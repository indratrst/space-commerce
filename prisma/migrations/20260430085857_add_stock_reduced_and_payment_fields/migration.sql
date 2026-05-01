/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "paymentMethod" TEXT,
ADD COLUMN     "stockReduced" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "variantNameAtPurchase" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_externalId_key" ON "Order"("externalId");
