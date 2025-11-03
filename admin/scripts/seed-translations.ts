import { PrismaClient } from '@prisma/client';
import { TRANSLATION_KEYS } from '../content/translation-keys';

const prisma = new PrismaClient();

async function seedTranslations() {
  console.log('Starting translation seeding...');
  
  let createdCount = 0;
  let updatedCount = 0;

  for (const keyData of TRANSLATION_KEYS) {
    const { page, section, key, en } = keyData;
    
    try {
      const existingTranslation = await prisma.translation.findUnique({
        where: { page_section_key: { page, section, key } }
      });

      if (existingTranslation) {
        // Update existing with English default if empty
        if (!existingTranslation.en && en) {
          await prisma.translation.update({
            where: { id: existingTranslation.id },
            data: { en }
          });
          console.log(`Updated: ${page}.${section}.${key}`);
          updatedCount++;
        }
      } else {
        // Create new translation
        await prisma.translation.create({
          data: {
            page,
            section,
            key,
            en: en || '',
            tk: '',
            ru: ''
          }
        });
        console.log(`Created: ${page}.${section}.${key}`);
        createdCount++;
      }
    } catch (error) {
      console.error(`Error processing ${page}.${section}.${key}:`, error);
    }
  }

  console.log('\nTranslation seeding completed!');
  console.log(`Created: ${createdCount} translations`);
  console.log(`Updated: ${updatedCount} translations`);
  console.log(`Total processed: ${TRANSLATION_KEYS.length} keys`);
}

seedTranslations()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
