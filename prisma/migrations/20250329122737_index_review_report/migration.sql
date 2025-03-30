/*
  Warnings:

  - A unique constraint covering the columns `[reporterId,customerId,businessId]` on the table `ReviewReport` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ReviewReport" ALTER COLUMN "reason" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "ReviewReport_customerId_idx" ON "ReviewReport"("customerId");

-- CreateIndex
CREATE INDEX "ReviewReport_businessId_idx" ON "ReviewReport"("businessId");

-- CreateIndex
CREATE INDEX "ReviewReport_reporterId_idx" ON "ReviewReport"("reporterId");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewReport_reporterId_customerId_businessId_key" ON "ReviewReport"("reporterId", "customerId", "businessId");
