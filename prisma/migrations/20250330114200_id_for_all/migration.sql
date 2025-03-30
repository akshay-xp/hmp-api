/*
  Warnings:

  - The primary key for the `Review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `businessId` on the `ReviewReport` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `ReviewReport` table. All the data in the column will be lost.
  - The primary key for the `TagsOnReviews` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `businessId` on the `TagsOnReviews` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `TagsOnReviews` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[businessId,customerId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reporterId,reviewId]` on the table `ReviewReport` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tagId,reviewId]` on the table `TagsOnReviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reviewId` to the `ReviewReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewId` to the `TagsOnReviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ReviewReport" DROP CONSTRAINT "ReviewReport_businessId_customerId_fkey";

-- DropForeignKey
ALTER TABLE "TagsOnReviews" DROP CONSTRAINT "TagsOnReviews_businessId_customerId_fkey";

-- DropIndex
DROP INDEX "ReviewReport_businessId_idx";

-- DropIndex
DROP INDEX "ReviewReport_customerId_idx";

-- DropIndex
DROP INDEX "ReviewReport_reporterId_customerId_businessId_key";

-- DropIndex
DROP INDEX "TagsOnReviews_businessId_idx";

-- DropIndex
DROP INDEX "TagsOnReviews_customerId_idx";

-- AlterTable
ALTER TABLE "Review" DROP CONSTRAINT "Review_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Review_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ReviewReport" DROP COLUMN "businessId",
DROP COLUMN "customerId",
ADD COLUMN     "reviewId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TagsOnReviews" DROP CONSTRAINT "TagsOnReviews_pkey",
DROP COLUMN "businessId",
DROP COLUMN "customerId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "reviewId" INTEGER NOT NULL,
ADD CONSTRAINT "TagsOnReviews_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Review_businessId_customerId_key" ON "Review"("businessId", "customerId");

-- CreateIndex
CREATE INDEX "ReviewReport_reviewId_idx" ON "ReviewReport"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewReport_reporterId_reviewId_key" ON "ReviewReport"("reporterId", "reviewId");

-- CreateIndex
CREATE INDEX "TagsOnReviews_reviewId_idx" ON "TagsOnReviews"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "TagsOnReviews_tagId_reviewId_key" ON "TagsOnReviews"("tagId", "reviewId");

-- AddForeignKey
ALTER TABLE "TagsOnReviews" ADD CONSTRAINT "TagsOnReviews_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewReport" ADD CONSTRAINT "ReviewReport_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;
