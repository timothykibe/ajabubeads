-- CreateTable
CREATE TABLE "SavedProduct" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT,
    "size" INTEGER,
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SavedProduct_userId_idx" ON "SavedProduct"("userId");

-- CreateIndex
CREATE INDEX "SavedProduct_productId_idx" ON "SavedProduct"("productId");

-- CreateIndex
CREATE INDEX "Media_fileName_idx" ON "Media"("fileName");

-- CreateIndex
CREATE INDEX "Media_createdAt_idx" ON "Media"("createdAt");

-- AddForeignKey
ALTER TABLE "SavedProduct" ADD CONSTRAINT "SavedProduct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedProduct" ADD CONSTRAINT "SavedProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
