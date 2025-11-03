-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Translation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "page" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "en" TEXT NOT NULL DEFAULT '',
    "tk" TEXT NOT NULL DEFAULT '',
    "ru" TEXT NOT NULL DEFAULT '',
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Translation" ("en", "id", "key", "page", "ru", "section", "tk", "updatedAt") SELECT "en", "id", "key", "page", "ru", "section", "tk", "updatedAt" FROM "Translation";
DROP TABLE "Translation";
ALTER TABLE "new_Translation" RENAME TO "Translation";
CREATE UNIQUE INDEX "Translation_page_section_key_key" ON "Translation"("page", "section", "key");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
