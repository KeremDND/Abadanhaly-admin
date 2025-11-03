/*
  Warnings:

  - You are about to drop the column `description` on the `TranslationKey` table. All the data in the column will be lost.
  - You are about to drop the column `namespace` on the `TranslationKey` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `TranslationValue` table. All the data in the column will be lost.
  - Added the required column `page` to the `TranslationKey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `section` to the `TranslationKey` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TranslationKey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "page" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "key" TEXT NOT NULL
);
INSERT INTO "new_TranslationKey" ("id", "key") SELECT "id", "key" FROM "TranslationKey";
DROP TABLE "TranslationKey";
ALTER TABLE "new_TranslationKey" RENAME TO "TranslationKey";
CREATE UNIQUE INDEX "TranslationKey_page_section_key_key" ON "TranslationKey"("page", "section", "key");
CREATE TABLE "new_TranslationValue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "keyId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    CONSTRAINT "TranslationValue_keyId_fkey" FOREIGN KEY ("keyId") REFERENCES "TranslationKey" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TranslationValue" ("id", "keyId", "locale", "value") SELECT "id", "keyId", "locale", "value" FROM "TranslationValue";
DROP TABLE "TranslationValue";
ALTER TABLE "new_TranslationValue" RENAME TO "TranslationValue";
CREATE UNIQUE INDEX "TranslationValue_keyId_locale_key" ON "TranslationValue"("keyId", "locale");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
