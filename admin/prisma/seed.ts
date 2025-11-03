import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function upsertPage(slug: string, template: any, blocks: Array<{ type: any; data: any }>) {
  const page = await prisma.page.upsert({
    where: { slug },
    update: {},
    create: { slug, status: "PUBLISHED", template, seoTitle: `Abadan Haly — ${slug}` },
  });
  let order = 1;
  for (const b of blocks) {
    await prisma.block.create({ data: { pageId: page.id, type: b.type, order: order++, data: b.data } });
  }
}

async function main() {
  const password = await bcrypt.hash("AdminPassw0rd!!", 12);
  await prisma.user.upsert({ where: { email: "admin@abadan.haly" }, update: {}, create: { email: "admin@abadan.haly", name: "Admin", passwordHash: password, role: "ADMIN" } });

  await upsertPage("home", "HOME", [
    { type: "HERO", data: { title: "Abadan Haly, Owadan Haly", subtitle: "24/7 Vandewiele • Neumag PP • ISO", image: "/images/page-hero/hero.jpg", ctaLabel: "Galereýa", ctaHref: "/gallery" } },
    { type: "SERVICES", data: { items: [{ title: "Mugt ölçeg", desc: "Öýde mugt ölçeg hyzmaty" }, { title: "Mugt eltip bermek", desc: "Aşgabatda çalt eltip bermek" }, { title: "Özleşdirme", desc: "Ölçeg we nagyş boýunça ýörite sargyt" }] } },
    { type: "MILESTONES", data: { items: [{ k: "Designs", v: "400+" }, { k: "Years", v: "8+" }, { k: "3M m²", v: "2020" }, { k: "ISO", v: "9001/14001/45001" }] } },
  ]);

  await upsertPage("about", "ABOUT", [
    { type: "PARAGRAPH", data: { title: "Biz barada", body: "2016-dan bäri 8 Vandewiele seti bilen 24/7 önümçilik. Neumag PP sapak. ISO ulgamlar. AR/3D syn." } },
  ]);

  await upsertPage("gallery", "GALLERY", [
    { type: "GALLERY", data: { folder: "/images/Halylar" } },
  ]);

  await upsertPage("collaboration", "COLLAB", [
    { type: "PARAGRAPH", data: { title: "B2B / OEM", body: "Eksport, ýörite bellik, logistika we hil resminamalary." } },
  ]);

  const cat = await prisma.category.upsert({ where: { slug: "cream" }, update: {}, create: { name: "Cream", slug: "cream", colorTag: "CREAM" } });
  const p = await prisma.product.upsert({ where: { sku: "GUNES-CREAM-200x300" }, update: {}, create: { sku: "GUNES-CREAM-200x300", name: "Güneş Cream", slug: "gunes-cream", description: "Traditional pattern", categoryId: cat.id, isActive: true } });
  await prisma.productVariant.upsert({ where: { id: `${p.id}-seed` }, update: {}, create: { id: `${p.id}-seed`, productId: p.id, color: "CREAM", size: "L_200x300", priceCents: 0, stock: 10, currency: "TMT" } });

  console.log("Seed complete");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
