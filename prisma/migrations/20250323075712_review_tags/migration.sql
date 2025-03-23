-- CreateTable
CREATE TABLE "ReviewTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ReviewTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagsOnReviews" (
    "tagId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "businessId" INTEGER NOT NULL,

    CONSTRAINT "TagsOnReviews_pkey" PRIMARY KEY ("tagId","businessId","customerId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReviewTag_name_key" ON "ReviewTag"("name");

-- CreateIndex
CREATE INDEX "TagsOnReviews_tagId_idx" ON "TagsOnReviews"("tagId");

-- CreateIndex
CREATE INDEX "TagsOnReviews_businessId_idx" ON "TagsOnReviews"("businessId");

-- CreateIndex
CREATE INDEX "TagsOnReviews_customerId_idx" ON "TagsOnReviews"("customerId");

-- AddForeignKey
ALTER TABLE "TagsOnReviews" ADD CONSTRAINT "TagsOnReviews_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "ReviewTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnReviews" ADD CONSTRAINT "TagsOnReviews_businessId_customerId_fkey" FOREIGN KEY ("businessId", "customerId") REFERENCES "Review"("businessId", "customerId") ON DELETE CASCADE ON UPDATE CASCADE;
