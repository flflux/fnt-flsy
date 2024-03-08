/*
  Warnings:

  - A unique constraint covering the columns `[name,society_id]` on the table `buildings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[number,floor_id]` on the table `flats` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[number,building_id]` on the table `floors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `societies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `societies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "societies" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "buildings_name_society_id_key" ON "buildings"("name", "society_id");

-- CreateIndex
CREATE UNIQUE INDEX "flats_number_floor_id_key" ON "flats"("number", "floor_id");

-- CreateIndex
CREATE UNIQUE INDEX "floors_number_building_id_key" ON "floors"("number", "building_id");

-- CreateIndex
CREATE UNIQUE INDEX "societies_code_key" ON "societies"("code");
