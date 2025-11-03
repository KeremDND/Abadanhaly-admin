import { PrismaClient } from '../src/generated/prisma';

const db = new PrismaClient();

type L = 'tk' | 'ru' | 'en';

async function put(page: string, section: string, key: string, vals: Record<L, string>) {
  const k = await db.translationKey.upsert({
    where: { page_section_key: { page, section, key } },
    update: {},
    create: { page, section, key }
  });
  
  for (const l of ['tk', 'ru', 'en'] as L[]) {
    await db.translationValue.upsert({
      where: { key_locale: { keyId: k.id, locale: l } },
      update: { value: vals[l] },
      create: { keyId: k.id, locale: l, value: vals[l] }
    });
  }
}

async function main() {
  // Common navigation
  await put('common', 'nav', 'home', { tk: 'Baş sahypa', ru: 'Главная', en: 'Home' });
  await put('common', 'nav', 'about', { tk: 'Biz barada', ru: 'О нас', en: 'About' });
  await put('common', 'nav', 'gallery', { tk: 'Galereýa', ru: 'Галерея', en: 'Gallery' });
  await put('common', 'nav', 'collaboration', { tk: 'Hyzmatdaşlyk', ru: 'Сотрудничество', en: 'Collaboration' });
  await put('common', 'nav', 'contact', { tk: 'Habarlaşmak', ru: 'Контакты', en: 'Contact' });

  // Home page
  await put('home', 'hero', 'title', { tk: 'Abadan Haly, Owadan Haly', ru: 'Abadan Haly, Красивые ковры', en: 'Abadan Haly, Beautiful Carpets' });
  await put('home', 'hero', 'subtitle', { tk: 'Türkmen halylarynyň halkara derejesindäki öndürjisi', ru: 'Международный производитель туркменских ковров', en: 'International producer of Turkmen carpets' });
  await put('home', 'hero', 'cta', { tk: 'Haly gör', ru: 'Посмотреть ковры', en: 'View Carpets' });

  // About page
  await put('about', 'hero', 'title', { tk: 'Biz barada', ru: 'О нас', en: 'About Us' });
  await put('about', 'hero', 'subtitle', { tk: 'Abadan Haly - türkmen halylarynyň halkara derejesindäki öndürjisi', ru: 'Abadan Haly - международный производитель туркменских ковров', en: 'Abadan Haly - international producer of Turkmen carpets' });

  // Gallery page
  await put('gallery', 'hero', 'title', { tk: 'Haly galereýasy', ru: 'Галерея ковров', en: 'Carpet Gallery' });
  await put('gallery', 'hero', 'subtitle', { tk: 'Bizim halylarymyzyň çeşitli görnüşleri', ru: 'Разнообразие наших ковров', en: 'Variety of our carpets' });

  // Collaboration page
  await put('collaboration', 'hero', 'title', { tk: 'Hyzmatdaşlyk', ru: 'Сотрудничество', en: 'Collaboration' });
  await put('collaboration', 'hero', 'subtitle', { tk: 'Biz bilen hyzmatdaşlyk etmek üçin', ru: 'Для сотрудничества с нами', en: 'To collaborate with us' });

  // Footer
  await put('common', 'footer', 'copyright', { tk: '© 2024 Abadan Haly. Ähli hukuklar goragly.', ru: '© 2024 Abadan Haly. Все права защищены.', en: '© 2024 Abadan Haly. All rights reserved.' });
  await put('common', 'footer', 'address', { tk: 'Aşgabat, Türkmenistan', ru: 'Ашхабад, Туркменистан', en: 'Ashgabat, Turkmenistan' });

  console.log('✅ Translations seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
