/*
  Warnings:

  - You are about to drop the `_CardToDevice` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[device_id,number]` on the table `cards` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `device_id` to the `cards` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CardToDevice" DROP CONSTRAINT "_CardToDevice_A_fkey";

-- DropForeignKey
ALTER TABLE "_CardToDevice" DROP CONSTRAINT "_CardToDevice_B_fkey";

-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "device_id" INTEGER NOT NULL,
ADD COLUMN     "flatId" INTEGER;

-- DropTable
DROP TABLE "_CardToDevice";

-- CreateIndex
CREATE UNIQUE INDEX "cards_device_id_number_key" ON "cards"("device_id", "number");

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_flatId_fkey" FOREIGN KEY ("flatId") REFERENCES "flats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
