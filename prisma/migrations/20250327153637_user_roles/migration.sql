-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'BUSINESS');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'BUSINESS';
