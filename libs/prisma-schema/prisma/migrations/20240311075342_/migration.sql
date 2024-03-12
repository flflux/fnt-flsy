-- DropForeignKey
ALTER TABLE "vehicle_logs" DROP CONSTRAINT "vehicle_logs_vehicle_id_fkey";

-- AlterTable
ALTER TABLE "vehicle_logs" ADD COLUMN     "is_forced_open" BOOLEAN DEFAULT false,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "direction" DROP NOT NULL,
ALTER COLUMN "vehicle_card_id" DROP NOT NULL,
ALTER COLUMN "vehicle_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "vehicle_logs" ADD CONSTRAINT "vehicle_logs_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
