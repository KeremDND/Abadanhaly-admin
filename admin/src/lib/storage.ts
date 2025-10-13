import path from "path";
import fs from "fs/promises";
import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { put as blobPut } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";

export type StorageResult = {
  url: string;
  width?: number;
  height?: number;
  sizeBytes: number;
  mime: string;
  variants?: Array<{ format: "webp" | "avif"; url: string; width: number; height: number; sizeBytes: number; mime: string }>; // optimized variants
};

const IMAGE_MIME_WHITELIST = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MODEL_MIME_WHITELIST = new Set(["model/gltf-binary", "model/gltf+json", "application/octet-stream"]);

function isImage(mime: string) {
  return IMAGE_MIME_WHITELIST.has(mime);
}

function isModel(mime: string, filename: string) {
  if (MODEL_MIME_WHITELIST.has(mime)) return true;
  return filename.endsWith(".glb") || filename.endsWith(".gltf");
}

export async function saveUpload(filename: string, bytes: Buffer): Promise<StorageResult> {
  const detected = await fileTypeFromBuffer(bytes);
  const mime = detected?.mime || "application/octet-stream";
  const storage = process.env.STORAGE_PROVIDER || "local";

  const id = uuidv4();
  const baseName = `${id}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

  if (storage === "local") {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const destPath = path.join(uploadsDir, baseName);
    await fs.writeFile(destPath, bytes);

    const result: StorageResult = {
      url: `/uploads/${baseName}`,
      sizeBytes: bytes.length,
      mime,
    };

    if (isImage(mime)) {
      const img = sharp(bytes);
      const meta = await img.metadata();
      result.width = meta.width;
      result.height = meta.height;

      const webpBuf = await img.webp({ quality: 82 }).toBuffer();
      const webpName = baseName.replace(/\.[^.]+$/, ".webp");
      await fs.writeFile(path.join(uploadsDir, webpName), webpBuf);

      const avifBuf = await img.avif({ quality: 50 }).toBuffer();
      const avifName = baseName.replace(/\.[^.]+$/, ".avif");
      await fs.writeFile(path.join(uploadsDir, avifName), avifBuf);

      result.variants = [
        { format: "webp", url: `/uploads/${webpName}`, width: meta.width || 0, height: meta.height || 0, sizeBytes: webpBuf.length, mime: "image/webp" },
        { format: "avif", url: `/uploads/${avifName}`, width: meta.width || 0, height: meta.height || 0, sizeBytes: avifBuf.length, mime: "image/avif" },
      ];
    }

    return result;
  }

  if (storage === "s3") {
    const bucket = process.env.S3_BUCKET!;
    const region = process.env.S3_REGION!;
    const endpoint = process.env.S3_ENDPOINT;
    const s3 = new S3Client({ region, endpoint, forcePathStyle: Boolean(endpoint), credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID!, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY! } });

    const key = `uploads/${baseName}`;
    await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: bytes, ContentType: mime }));
    const url = endpoint ? `${endpoint}/${bucket}/${key}` : `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    const result: StorageResult = { url, sizeBytes: bytes.length, mime };

    if (isImage(mime)) {
      const img = sharp(bytes);
      const meta = await img.metadata();
      result.width = meta.width;
      result.height = meta.height;
      const webp = await img.webp({ quality: 82 }).toBuffer();
      const webpKey = `uploads/${baseName.replace(/\.[^.]+$/, ".webp")}`;
      await s3.send(new PutObjectCommand({ Bucket: bucket, Key: webpKey, Body: webp, ContentType: "image/webp" }));
      const avif = await img.avif({ quality: 50 }).toBuffer();
      const avifKey = `uploads/${baseName.replace(/\.[^.]+$/, ".avif")}`;
      await s3.send(new PutObjectCommand({ Bucket: bucket, Key: avifKey, Body: avif, ContentType: "image/avif" }));
      result.variants = [
        { format: "webp", url: endpoint ? `${endpoint}/${bucket}/${webpKey}` : `https://${bucket}.s3.${region}.amazonaws.com/${webpKey}`, width: meta.width || 0, height: meta.height || 0, sizeBytes: webp.length, mime: "image/webp" },
        { format: "avif", url: endpoint ? `${endpoint}/${bucket}/${avifKey}` : `https://${bucket}.s3.${region}.amazonaws.com/${avifKey}`, width: meta.width || 0, height: meta.height || 0, sizeBytes: avif.length, mime: "image/avif" },
      ];
    }

    return result;
  }

  if (storage === "blob") {
    const key = `uploads/${baseName}`;
    const put = await blobPut(key, bytes, { access: "public", contentType: mime });
    const result: StorageResult = { url: put.url, sizeBytes: bytes.length, mime };
    if (isImage(mime)) {
      const img = sharp(bytes);
      const meta = await img.metadata();
      result.width = meta.width;
      result.height = meta.height;
      const webp = await img.webp({ quality: 82 }).toBuffer();
      const webpPut = await blobPut(`uploads/${baseName.replace(/\.[^.]+$/, ".webp")}`, webp, { access: "public", contentType: "image/webp" });
      const avif = await img.avif({ quality: 50 }).toBuffer();
      const avifPut = await blobPut(`uploads/${baseName.replace(/\.[^.]+$/, ".avif")}`, avif, { access: "public", contentType: "image/avif" });
      result.variants = [
        { format: "webp", url: webpPut.url, width: meta.width || 0, height: meta.height || 0, sizeBytes: webp.length, mime: "image/webp" },
        { format: "avif", url: avifPut.url, width: meta.width || 0, height: meta.height || 0, sizeBytes: avif.length, mime: "image/avif" },
      ];
    }
    return result;
  }

  throw new Error(`Unsupported STORAGE_PROVIDER: ${storage}`);
}

export function validateAllowedFile(filename: string, mime: string) {
  const lower = filename.toLowerCase();
  if (isImage(mime)) return true;
  if (isModel(mime, lower)) return true;
  return false;
}
