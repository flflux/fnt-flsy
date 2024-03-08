-- AlterTable
ALTER TABLE "vehicle_logs" DROP COLUMN "date_time",
ADD COLUMN     "entry_time" TIMESTAMPTZ(6) NOT NULL;

