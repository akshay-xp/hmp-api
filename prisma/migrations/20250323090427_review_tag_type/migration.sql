/*
  Warnings:

  - Added the required column `type` to the `ReviewTag` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TagType" AS ENUM ('POSITIVE', 'NEGATIVE');

-- AlterTable
ALTER TABLE "ReviewTag" ADD COLUMN     "type" "TagType" NOT NULL;
