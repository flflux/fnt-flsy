-- DropForeignKey
ALTER TABLE "residents_flats" DROP CONSTRAINT "residents_flats_flat_id_fkey";

-- DropForeignKey
ALTER TABLE "residents_flats" DROP CONSTRAINT "residents_flats_resident_id_fkey";

-- AddForeignKey
ALTER TABLE "residents_flats" ADD CONSTRAINT "residents_flats_flat_id_fkey" FOREIGN KEY ("flat_id") REFERENCES "flats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "residents_flats" ADD CONSTRAINT "residents_flats_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "residents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
