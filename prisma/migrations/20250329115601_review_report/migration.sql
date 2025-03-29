-- CreateTable
CREATE TABLE "ReviewReport" (
    "id" SERIAL NOT NULL,
    "reason" TEXT NOT NULL,
    "customerId" INTEGER NOT NULL,
    "businessId" INTEGER NOT NULL,
    "reporterId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReviewReport" ADD CONSTRAINT "ReviewReport_businessId_customerId_fkey" FOREIGN KEY ("businessId", "customerId") REFERENCES "Review"("businessId", "customerId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewReport" ADD CONSTRAINT "ReviewReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
