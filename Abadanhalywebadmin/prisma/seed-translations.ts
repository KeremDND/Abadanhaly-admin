import { PrismaClient } from "../src/generated/prisma";

const db = new PrismaClient();

type Locale = "tk" | "ru" | "en";

async function put(
  page: string,
  section: string,
  key: string,
  values: { tk?: string; ru?: string; en?: string }
) {
  const k = await db.translationKey.upsert({
    where: { page_section_key: { page, section, key } },
    update: {},
    create: { page, section, key },
  });
  for (const loc of ["tk", "ru", "en"] as Locale[]) {
    await db.translationValue.upsert({
      where: { key_locale: { keyId: k.id, locale: loc } },
      update: { value: values[loc] || "" },
      create: { keyId: k.id, locale: loc, value: values[loc] || "" },
    });
  }
}

async function main() {
  // Shared - Language
  await put("shared", "lang", "tk", { en: "Turkmen" });
  await put("shared", "lang", "ru", { en: "Russian" });
  await put("shared", "lang", "en", { en: "English" });

  // Shared - Header
  await put("shared", "header", "brand", { en: "Abadan Haly" });
  await put("shared", "header", "nav.home", { en: "Home" });
  await put("shared", "header", "nav.gallery", { en: "Gallery" });
  await put("shared", "header", "nav.collaboration", { en: "Collaboration" });
  await put("shared", "header", "nav.about", { en: "About" });
  await put("shared", "header", "nav.stores", { en: "Stores" });
  await put("shared", "header", "cta.viewAR", { en: "View in AR" });

  // Shared - Buttons
  await put("shared", "buttons", "primary.explore", { en: "Explore Carpets" });
  await put("shared", "buttons", "secondary.getDirections", { en: "Get Directions" });
  await put("shared", "buttons", "secondary.contact", { en: "Contact Us" });

  // Shared - Footer
  await put("shared", "footer", "title", { en: "Abadan Haly — Owadan Haly" });
  await put("shared", "footer", "desc", { en: "Turkmen carpets, crafted at scale for real homes." });
  await put("shared", "footer", "col.company", { en: "Company" });
  await put("shared", "footer", "col.support", { en: "Support" });
  await put("shared", "footer", "col.legal", { en: "Legal" });
  await put("shared", "footer", "link.privacy", { en: "Privacy Policy" });
  await put("shared", "footer", "link.terms", { en: "Terms of Service" });
  await put("shared", "footer", "copy", { en: "© Abadan Haly. All rights reserved." });

  // Home - Hero
  await put("home", "hero", "title", { en: "Abadan Haly, Owadan Haly" });
  await put("home", "hero", "subtitle", { en: "24/7 Vandewiele • Neumag PP • ISO" });
  await put("home", "hero", "ctaPrimary", { en: "Explore Carpets" });
  await put("home", "hero", "ctaSecondary", { en: "View in AR" });
  await put("home", "hero", "metric.designs", { en: "400+ designs" });
  await put("home", "hero", "metric.years", { en: "8+ years" });
  await put("home", "hero", "metric.volume", { en: "3M m² (2020)" });

  // Home - Highlights
  await put("home", "highlights", "title", { en: "Highlights from Gallery" });
  await put("home", "highlights", "desc", { en: "A few favorites—see textures, detail and 3D view." });
  await put("home", "highlights", "cta", { en: "Open Gallery" });

  // Home - Services
  await put("home", "services", "title", { en: "Our Services" });
  await put("home", "services", "measureTitle", { en: "Free Measuring" });
  await put("home", "services", "measureDesc", { en: "Home measuring at no cost." });
  await put("home", "services", "deliveryTitle", { en: "Free Delivery" });
  await put("home", "services", "deliveryDesc", { en: "Fast delivery in Ashgabat." });
  await put("home", "services", "customTitle", { en: "Custom Sizes & Design" });
  await put("home", "services", "customDesc", { en: "Tailored sizes and motifs." });

  // Home - Milestones
  await put("home", "milestones", "title", { en: "Milestones & Certificates" });
  await put("home", "milestones", "designs", { en: "400+ designs" });
  await put("home", "milestones", "years", { en: "8+ years" });
  await put("home", "milestones", "record", { en: "3M m² (2020)" });
  await put("home", "milestones", "iso", { en: "ISO 9001/14001/45001" });

  // Home - Stores
  await put("home", "stores", "title", { en: "Find a Store" });
  await put("home", "stores", "desc", { en: "We'll highlight the closest Abadan Haly store." });
  await put("home", "stores", "label.closest", { en: "Closest store" });
  await put("home", "stores", "cta", { en: "Get Directions" });

  // Home - AR Banner
  await put("home", "arBanner", "title", { en: "Preview carpets in your room" });
  await put("home", "arBanner", "desc", { en: "Open the 3D viewer and place it at home." });
  await put("home", "arBanner", "cta", { en: "Try AR Viewer" });

  // Home - 3D
  await put("home", "3d", "loading", { en: "Loading 3D model…" });
  await put("home", "3d", "controls", { en: "Drag to rotate • Scroll to zoom" });
  await put("home", "3d", "view.flat", { en: "Flat" });
  await put("home", "3d", "view.room", { en: "Room" });
  await put("home", "3d", "view.detail", { en: "Detail" });
  await put("home", "3d", "lighting.natural", { en: "Natural" });
  await put("home", "3d", "lighting.studio", { en: "Studio" });
  await put("home", "3d", "reset", { en: "Reset View" });

  // Home - SEO
  await put("home", "seo", "title", { en: "Abadan Haly — Turkmen carpets: modern quality, classic craft" });
  await put("home", "seo", "description", { en: "Modern Turkmen carpets with ISO quality, 24/7 production and AR/3D preview. Free measuring & delivery in Turkmenistan." });

  // Collaboration - Hero
  await put("collaboration", "hero", "title", { en: "Collaboration with Abadan Haly" });
  await put("collaboration", "hero", "subtitle", { en: "Partnering with designers, retailers, and institutions to bring Turkmen carpets worldwide." });
  await put("collaboration", "hero", "ctaPrimary", { en: "Become a Partner" });
  await put("collaboration", "hero", "ctaSecondary", { en: "Contact Our Team" });

  // Collaboration - Intro
  await put("collaboration", "intro", "title", { en: "Why Collaborate with Abadan Haly?" });
  await put("collaboration", "intro", "desc", { en: "We combine traditional craftsmanship with industrial precision. Our in-house design and production capabilities let us tailor carpets for every concept and project scale." });

  // Collaboration - Benefits
  await put("collaboration", "benefits", "title", { en: "Partnership Benefits" });
  await put("collaboration", "benefits", "b1Title", { en: "OEM & Private Label Production" });
  await put("collaboration", "benefits", "b1Desc", { en: "Produce your own branded carpets using our 8 Vandewiele looms and Neumag PP yarn facility." });
  await put("collaboration", "benefits", "b2Title", { en: "Architect & Designer Support" });
  await put("collaboration", "benefits", "b2Desc", { en: "Custom samples, digital textures, and 3D models for interiors and visualizations." });
  await put("collaboration", "benefits", "b3Title", { en: "Reliable B2B Logistics" });
  await put("collaboration", "benefits", "b3Desc", { en: "Certified export operations to Kazakhstan, Afghanistan, Turkey — ready for global shipment." });
  await put("collaboration", "benefits", "b4Title", { en: "Quality & Certification" });
  await put("collaboration", "benefits", "b4Desc", { en: "ISO 9001 / 14001 / 45001 — consistent quality assurance across every batch." });

  // Collaboration - Process
  await put("collaboration", "process", "title", { en: "How It Works" });
  await put("collaboration", "process", "step1Title", { en: "1. Send Your Idea" });
  await put("collaboration", "process", "step1Desc", { en: "Provide sketches, color palettes, or mood boards." });
  await put("collaboration", "process", "step2Title", { en: "2. Design Adaptation" });
  await put("collaboration", "process", "step2Desc", { en: "Our team converts your vision into manufacturable patterns and technical layouts." });
  await put("collaboration", "process", "step3Title", { en: "3. Sampling & Approval" });
  await put("collaboration", "process", "step3Desc", { en: "We produce and ship a pre-production sample for confirmation." });
  await put("collaboration", "process", "step4Title", { en: "4. Production & Delivery" });
  await put("collaboration", "process", "step4Desc", { en: "After approval, carpets are woven, packed, and shipped according to your schedule." });

  // Collaboration - SEO
  await put("collaboration", "seo", "title", { en: "Collaboration — Partner with Abadan Haly" });
  await put("collaboration", "seo", "description", { en: "Join Abadan Haly as a B2B or design partner. OEM/private-label carpet production, export, and AR/3D visualization support." });

  // About - Hero
  await put("about", "hero", "title", { en: "About Abadan Haly" });
  await put("about", "hero", "subtitle", { en: "Turkmen carpets woven at scale since 2016 — rooted in heritage, built for modern homes." });
  await put("about", "hero", "ctaPrimary", { en: "Explore Our Carpets" });
  await put("about", "hero", "ctaSecondary", { en: "Visit Our Stores" });

  // About - Mission
  await put("about", "mission", "title", { en: "Mission & Values" });
  await put("about", "mission", "b1Title", { en: "Improve Quality" });
  await put("about", "mission", "b1Desc", { en: "Relentless refinement across design, materials, and production." });
  await put("about", "mission", "b2Title", { en: "Meet World Standards" });
  await put("about", "mission", "b2Desc", { en: "ISO 9001 / 14001 / 45001 certified systems and processes." });
  await put("about", "mission", "b3Title", { en: "Delight Customers" });
  await put("about", "mission", "b3Desc", { en: "Service built around real homes: fair pricing and fast delivery." });
  await put("about", "mission", "b4Title", { en: "Expand Internationally" });
  await put("about", "mission", "b4Desc", { en: "Export-ready operations and private-label partnerships." });

  // About - Story
  await put("about", "story", "title", { en: "Our Story" });
  await put("about", "story", "p1", { en: "Founded on 15 Feb 2016, Abadan Haly blends historic Turkmen motifs with modern, AI-assisted design." });
  await put("about", "story", "p2", { en: "From 3 looms at launch to 8 Vandewiele machines today, we operate 24/7 for reliable lead times." });

  // About - SEO
  await put("about", "seo", "title", { en: "About Abadan Haly — Turkmen Carpet Manufacturer & Retail" });
  await put("about", "seo", "description", { en: "Founded in 2016, Abadan Haly operates 8 Vandewiele looms with in-house Neumag PP yarn, ISO systems, and AR/3D preview. Retail in Turkmenistan, exports to regional markets." });

  // Gallery - Hero
  await put("gallery", "hero", "title", { en: "Carpet Gallery" });
  await put("gallery", "hero", "subtitle", { en: "Browse by color, size and style. View details in 3D/AR." });

  // Gallery - Filters
  await put("gallery", "filters", "title", { en: "Filters" });
  await put("gallery", "filters", "reset", { en: "Reset filters" });
  await put("gallery", "filters", "color", { en: "Color" });
  await put("gallery", "filters", "color.grey", { en: "Grey" });
  await put("gallery", "filters", "color.darkGrey", { en: "Dark Grey" });
  await put("gallery", "filters", "color.cream", { en: "Cream" });
  await put("gallery", "filters", "color.red", { en: "Red" });
  await put("gallery", "filters", "color.green", { en: "Green" });

  console.log("✅ Translation keys seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());

