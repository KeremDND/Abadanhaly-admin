import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

// Maps color string to ColorTag/VariantColor
function mapColor(color: string): "GREY" | "DARK_GREY" | "CREAM" | "RED" | "GREEN" | "OTHER" {
  const c = color.toLowerCase();
  if (c.includes("dark")) return "DARK_GREY";
  if (c.includes("grey")) return "GREY";
  if (c.includes("cream")) return "CREAM";
  if (c.includes("red")) return "RED";
  if (c.includes("green")) return "GREEN";
  return "OTHER";
}

async function run() {
  const file = path.join(process.cwd(), "..", "public", "data", "carpets.json");
  const raw = await fs.readFile(file, "utf-8");
  const items: any[] = JSON.parse(raw);

  for (const item of items) {
    const colorTag = mapColor(item.color || item.name || item.slug);
    const category = await prisma.category.upsert({
      where: { slug: colorTag.toLowerCase() },
      update: {},
      create: { name: colorTag.replace("_", " "), slug: colorTag.toLowerCase(), colorTag },
    });

    const baseSlug = (item.slug || item.id).replace(/[^a-z0-9-]/g, "-").toLowerCase();
    const product = await prisma.product.upsert({
      where: { slug: baseSlug },
      update: {},
      create: {
        sku: baseSlug,
        name: item.name || baseSlug,
        slug: baseSlug,
        description: item.alt || null,
        categoryId: category.id,
      },
    });

    // Default variant per product with mapped color, size unknown -> CUSTOM
    await prisma.productVariant.upsert({
      where: { productId_color_size: { productId: product.id, color: colorTag as any, size: "CUSTOM" } },
      update: {},
      create: { productId: product.id, color: colorTag as any, size: "CUSTOM", priceCents: 0, stock: 0 },
    });

    // Attach first image URL as media (store URL only)
    const jpg = item.srcset?.jpg?.[item.srcset.jpg.length - 1]?.src || item.src;
    if (jpg) {
      await prisma.media.create({
        data: {
          entityType: "PRODUCT",
          entityId: product.id,
          kind: "IMAGE",
          url: jpg,
          alt: item.alt || product.name,
          width: item.width || null as any,
          height: item.height || null as any,
          mime: "image/jpeg",
          orderIdx: 0,
        },
      });
    }
  }

  console.log(`Imported ${items.length} items`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
