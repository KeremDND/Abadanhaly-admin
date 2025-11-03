import { PrismaClient } from "../src/generated/prisma";

const db = new PrismaClient();

async function upsertStore(data: any) {
  return db.store.upsert({
    where: { slug: data.slug },
    update: data,
    create: data,
  });
}

async function main() {
  // REMOVE Gurtly completely
  await db.store.deleteMany({ where: { slug: "gurtly" } });

  await upsertStore({
    slug: "ceper",
    name: "Çeper Haly Dükany",
    type: "retail",
    address: "10yl Abadançylyk şaýoly, 86/2, Aşgabat",
    district: "Bagtyýarlyk",
    city: "Ashgabat",
    country: "Turkmenistan",
    phone: "+993 12 00 00 00",
    whatsapp: "+993 65 000000",
    email: "store@abadanhaly.com",
    mapsUrl: "https://maps.google.com/?q=37.9609,58.3469",
    latitude: 37.9609,
    longitude: 58.3469,
    hours: JSON.stringify({
      mon: "09:00-19:00",
      tue: "09:00-19:00",
      wed: "09:00-19:00",
      thu: "09:00-19:00",
      fri: "09:00-19:00",
      sat: "10:00-18:00",
      sun: "Closed",
    }),
    services: JSON.stringify({ freeMeasure: true, delivery: true, custom: true }),
    deliveryKm: 20,
    priority: 1,
    isActive: true,
    seoTitle: "Çeper Haly Dükany — Abadan Haly",
    seoDesc: "Official Abadan Haly retail store in Ashgabat.",
  });

  await upsertStore({
    slug: "buzmein",
    name: "Büzmeýin Haly Dükany",
    type: "retail",
    address: "Altyn Asyr köçesi, 27.jay",
    district: "Büzmeýin",
    city: "Ashgabat",
    country: "Turkmenistan",
    phone: "+993 12 00 00 01",
    whatsapp: "+993 65 000001",
    email: "buzmein@abadanhaly.com",
    mapsUrl: "https://maps.google.com/?q=37.8948,58.3101",
    latitude: 37.8948,
    longitude: 58.3101,
    hours: JSON.stringify({
      mon: "09:00-19:00",
      tue: "09:00-19:00",
      wed: "09:00-19:00",
      thu: "09:00-19:00",
      fri: "09:00-19:00",
      sat: "10:00-18:00",
      sun: "Closed",
    }),
    services: JSON.stringify({ freeMeasure: true, delivery: true, custom: true }),
    deliveryKm: 20,
    priority: 2,
    isActive: true,
    seoTitle: "Büzmeýin Haly Dükany — Abadan Haly",
    seoDesc: "Official Abadan Haly retail store in Büzmeýin.",
  });

  await upsertStore({
    slug: "hq",
    name: "Abadan Haly — HQ & Factory",
    type: "hq",
    address: "Abadan Haly, Aşgabat — Headquarters",
    district: "Ashgabat",
    city: "Ashgabat",
    country: "Turkmenistan",
    phone: "+993 12 00 00 02",
    email: "hq@abadanhaly.com",
    mapsUrl: "https://maps.google.com/?q=37.9600,58.3600",
    latitude: 37.96,
    longitude: 58.36,
    services: JSON.stringify({}),
    priority: 0,
    isActive: true,
    seoTitle: "Abadan Haly Headquarters",
    seoDesc: "Manufacturing HQ of Abadan Haly.",
  });

  console.log("✅ Stores seeded and Gurtly removed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

