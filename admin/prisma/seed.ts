import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default admin
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
    },
  });

  console.log('Created admin:', admin.username);

  // Import translations from public/locales
  const localesDir = join(process.cwd(), '../../public/locales');
  const locales = ['en', 'tk', 'ru'];

  for (const locale of locales) {
    const filePath = join(localesDir, `${locale}.json`);
    
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf-8');
      const translations = JSON.parse(content);

      // Flatten nested JSON structure
      const flatten = (obj: any, prefix = '', page = 'home'): Array<{ page: string; section: string; key: string; locale: string; value: string }> => {
        const result: Array<{ page: string; section: string; key: string; locale: string; value: string }> = [];
        
        for (const [key, value] of Object.entries(obj)) {
          const newKey = prefix ? `${prefix}.${key}` : key;
          
          if (typeof value === 'object' && value !== null) {
            // Determine page from key structure
            let currentPage = page;
            if (key === 'nav' || key === 'footer') {
              currentPage = key;
            }
            
            result.push(...flatten(value, newKey, currentPage));
          } else {
            const parts = newKey.split('.');
            const section = parts.length > 1 ? parts[0] : 'general';
            const finalKey = parts.slice(1).join('.') || parts[0];
            
            result.push({
              page: currentPage,
              section,
              key: finalKey,
              locale,
              value: String(value),
            });
          }
        }
        
        return result;
      };

      const flatTranslations = flatten(translations, '', 'home');

      for (const t of flatTranslations) {
        await prisma.translation.upsert({
          where: {
            page_section_key_locale: {
              page: t.page,
              section: t.section,
              key: t.key,
              locale: t.locale,
            },
          },
          update: {
            value: t.value,
          },
          create: t,
        });
      }

      console.log(`Imported ${flatTranslations.length} translations for ${locale}`);
    }
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

