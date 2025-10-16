-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'published',
    "seoTitle" TEXT,
    "seoDesc" TEXT,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Block" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pageId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    CONSTRAINT "Block_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "altKeyId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "nameKeyId" TEXT,
    "descKeyId" TEXT,
    "color" TEXT NOT NULL,
    "sizes" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "altKeyId" TEXT,
    CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductImage_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'retail',
    "address" TEXT NOT NULL,
    "district" TEXT,
    "city" TEXT NOT NULL DEFAULT 'Ashgabat',
    "country" TEXT NOT NULL DEFAULT 'Turkmenistan',
    "latitude" REAL,
    "longitude" REAL,
    "phone" TEXT,
    "whatsapp" TEXT,
    "email" TEXT,
    "mapsUrl" TEXT,
    "hours" JSONB,
    "services" JSONB,
    "deliveryKm" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDesc" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "brandName" TEXT NOT NULL DEFAULT 'Abadan Haly',
    "primaryHex" TEXT NOT NULL DEFAULT '#0B6A43',
    "arEnabled" BOOLEAN NOT NULL DEFAULT true,
    "deliveryInfoKeyId" TEXT
);

-- CreateTable
CREATE TABLE "TranslationKey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "page" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "TranslationValue" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "keyId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    CONSTRAINT "TranslationValue_keyId_fkey" FOREIGN KEY ("keyId") REFERENCES "TranslationKey" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- CreateIndex
CREATE INDEX "Block_pageId_position_idx" ON "Block"("pageId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- CreateIndex
CREATE INDEX "ProductImage_productId_position_idx" ON "ProductImage"("productId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Store_slug_key" ON "Store"("slug");

-- CreateIndex
CREATE INDEX "TranslationKey_page_section_idx" ON "TranslationKey"("page", "section");

-- CreateIndex
CREATE UNIQUE INDEX "TranslationKey_page_section_key_key" ON "TranslationKey"("page", "section", "key");

-- CreateIndex
CREATE INDEX "TranslationValue_locale_idx" ON "TranslationValue"("locale");

-- CreateIndex
CREATE UNIQUE INDEX "TranslationValue_keyId_locale_key" ON "TranslationValue"("keyId", "locale");
