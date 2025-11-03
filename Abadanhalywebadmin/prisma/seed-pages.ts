import { PrismaClient } from "../src/generated/prisma";

const db = new PrismaClient();

async function upsertPage(
  slug: string,
  title: string,
  blocks: Array<{ kind: string; position: number; data: any }>
) {
  const page = await db.page.upsert({
    where: { slug },
    update: { title },
    create: { slug, title, status: "published" },
  });
  
  for (const b of blocks) {
    await db.block.create({
      data: {
        pageId: page.id,
        kind: b.kind,
        position: b.position,
        data: JSON.stringify(b.data),
      },
    });
  }
  console.log(`✅ Seeded page: ${slug}`);
}

async function main() {
  await upsertPage("home", "Home", [
    {
      kind: "hero",
      position: 1,
      data: {
        titleKey: "home.hero.title",
        subtitleKey: "home.hero.subtitle",
        ctaPrimaryKey: "home.hero.ctaPrimary",
        ctaSecondaryKey: "home.hero.ctaSecondary",
        image: "/Images/Abadan Haly website background.jpg",
      },
    },
    {
      kind: "services",
      position: 2,
      data: {
        titleKey: "home.services.title",
        items: [
          { titleKey: "home.services.measureTitle", descKey: "home.services.measureDesc" },
          { titleKey: "home.services.deliveryTitle", descKey: "home.services.deliveryDesc" },
          { titleKey: "home.services.customTitle", descKey: "home.services.customDesc" },
        ],
      },
    },
    {
      kind: "milestones",
      position: 3,
      data: {
        titleKey: "home.milestones.title",
        items: [
          { key: "home.milestones.designs" },
          { key: "home.milestones.years" },
          { key: "home.milestones.record" },
          { key: "home.milestones.iso" },
        ],
      },
    },
    {
      kind: "stores",
      position: 4,
      data: {
        titleKey: "home.stores.title",
        descKey: "home.stores.desc",
        ctaKey: "home.stores.cta",
      },
    },
  ]);

  await upsertPage("gallery", "Gallery", [
    {
      kind: "hero",
      position: 1,
      data: {
        titleKey: "gallery.hero.title",
        subtitleKey: "gallery.hero.subtitle",
      },
    },
  ]);

  await upsertPage("about", "About", [
    {
      kind: "hero",
      position: 1,
      data: {
        titleKey: "about.hero.title",
        subtitleKey: "about.hero.subtitle",
      },
    },
  ]);

  await upsertPage("collaboration", "Collaboration", [
    {
      kind: "hero",
      position: 1,
      data: {
        titleKey: "collaboration.hero.title",
        subtitleKey: "collaboration.hero.subtitle",
      },
    },
  ]);

  console.log("✅ All pages seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

