/*
  Warnings:

  - You are about to drop the `vehicle_logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "vehicle_logs" DROP CONSTRAINT "vehicle_logs_device_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicle_logs" DROP CONSTRAINT "vehicle_logs_society_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicle_logs" DROP CONSTRAINT "vehicle_logs_vehicle_card_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicle_logs" DROP CONSTRAINT "vehicle_logs_vehicle_id_fkey";

-- DropTable
DROP TABLE "vehicle_logs";

-- CreateTable
CREATE TABLE "device_logs" (
    "id" SERIAL NOT NULL,
    "status" "AccessStatus",
    "direction" "AccessDirection",
    "vehicle_card_id" INTEGER,
    "society_id" INTEGER NOT NULL,
    "device_id" INTEGER NOT NULL,
    "vehicle_id" INTEGER,
    "date_time" TIMESTAMPTZ NOT NULL,
    "is_forced_open" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "device_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "device_logs" ADD CONSTRAINT "device_logs_vehicle_card_id_fkey" FOREIGN KEY ("vehicle_card_id") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_logs" ADD CONSTRAINT "device_logs_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_logs" ADD CONSTRAINT "device_logs_society_id_fkey" FOREIGN KEY ("society_id") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_logs" ADD CONSTRAINT "device_logs_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
