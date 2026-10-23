/*
  Warnings:

  - You are about to drop the column `pendingCheckoutSessionId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "pendingCheckoutSessionId",
ADD COLUMN     "pendingMonthlyCheckoutSessionId" TEXT,
ADD COLUMN     "pendingYearlyCheckoutSessionId" TEXT;
