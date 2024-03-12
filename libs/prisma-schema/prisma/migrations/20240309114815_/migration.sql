/*
  Warnings:

  - You are about to drop the column `flatId` on the `cards` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "cards" DROP CONSTRAINT "cards_flatId_fkey";

-- AlterTable
ALTER TABLE "cards" DROP COLUMN "flatId",
ADD COLUMN     "flat_id" INTEGER;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_flat_id_fkey" FOREIGN KEY ("flat_id") REFERENCES "flats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
