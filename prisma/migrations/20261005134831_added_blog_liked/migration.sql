/*
  Warnings:

  - A unique constraint covering the columns `[featuredOrder]` on the table `Blog` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "featuredOrder" INTEGER;

-- CreateTable
CREATE TABLE "BlogLike" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "blogId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BlogLike_blogId_idx" ON "BlogLike"("blogId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogLike_userId_blogId_key" ON "BlogLike"("userId", "blogId");

-- CreateIndex
CREATE UNIQUE INDEX "Blog_featuredOrder_key" ON "Blog"("featuredOrder");

-- AddForeignKey
ALTER TABLE "BlogLike" ADD CONSTRAINT "BlogLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogLike" ADD CONSTRAINT "BlogLike_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
