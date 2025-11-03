import { PrismaClient } from "../src/generated/prisma";
import fs from "node:fs/promises";
import path from "node:path";

const db = new PrismaClient();
type Locale = "tk" | "ru" | "en";

async function putKey(
  page: string,
  section: string,
  key: string,
  vals: Record<Locale, string>
) {
  const k = await db.translationKey.upsert({
    where: { page_section_key: { page, section, key } },
    update: {},
    create: { page, section, key },
  });
  for (const loc of ["tk", "ru", "en"] as Locale[]) {
    await db.translationValue.upsert({
      where: { key_locale: { keyId: k.id, locale: loc } },
      update: { value: vals[loc] },
      create: { keyId: k.id, locale: loc, value: vals[loc] },
    });
  }
  return k.id;
}

async function main() {
  const base = path.join(process.cwd(), "..", "public", "Images", "Halylar");
  const colors = await fs.readdir(base);

  for (const color of colors) {
    const dir = path.join(base, color);
    const stat = await fs.stat(dir).catch(() => null);
    if (!stat?.isDirectory()) continue;

    const files = (await fs.readdir(dir)).filter((f) =>
      /\.(jpe?g|png|webp)$/i.test(f)
    );

    for (const file of files) {
      const slug = path.parse(file).name.toLowerCase().replace(/\s+/g, "-");
      const sku = `${color.toLowerCase().replace(/\s+/g, "-")}-${slug}`;

      const exists = await db.product.findUnique({ where: { sku } });
      if (exists) continue;

      const nameKeyId = await putKey("product", sku, "name", {
        tk: "",
        ru: "",
        en: `${color} carpet — ${slug}`,
      });
      const descKeyId = await putKey("product", sku, "desc", {
        tk: "",
        ru: "",
        en: "Abadan Haly manufacture. Dense weave, colorfast.",
      });

      const media = await db.media.create({
        data: { url: `/Images/Halylar/${color}/${file}` },
      });

      const product = await db.product.create({
        data: {
          slug,
          sku,
          color: color.toLowerCase().replace(/\s+/g, "-"),
          tags: color,
          sizes: "160x230,200x300,300x400",
          nameKeyId,
          descKeyId,
          isActive: true,
        },
      });

      await db.productImage.create({
        data: { productId: product.id, mediaId: media.id, position: 0 },
      });
    }
  }

  console.log("✅ Seeded products from /public/Images/Halylar");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());


