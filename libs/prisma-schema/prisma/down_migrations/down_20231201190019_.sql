-- AlterEnum
BEGIN;
CREATE TYPE "DeviceType_new" AS ENUM ('MONITORING', 'CONTROL');
ALTER TABLE "device_paramaters" ALTER COLUMN "type" TYPE "DeviceType_new" USING ("type"::text::"DeviceType_new");
ALTER TABLE "devices" ALTER COLUMN "type" TYPE "DeviceType_new" USING ("type"::text::"DeviceType_new");
ALTER TYPE "DeviceType" RENAME TO "DeviceType_old";
ALTER TYPE "DeviceType_new" RENAME TO "DeviceType";
DROP TYPE "DeviceType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "users_society_roles" DROP CONSTRAINT "users_society_roles_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users_society_roles" DROP CONSTRAINT "users_society_roles_society_role_id_fkey";

-- DropForeignKey
ALTER TABLE "users_society_roles" DROP CONSTRAINT "users_society_roles_society_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicles_devices" DROP CONSTRAINT "vehicles_devices_vehicle_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicles_devices" DROP CONSTRAINT "vehicles_devices_device_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicle_logs" DROP CONSTRAINT "vehicle_logs_device_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicle_logs" DROP CONSTRAINT "vehicle_logs_society_id_fkey";

-- DropForeignKey
ALTER TABLE "vehicle_logs" DROP CONSTRAINT "vehicle_logs_vehicle_id_fkey";

-- DropForeignKey
ALTER TABLE "devices" DROP CONSTRAINT "devices_society_id_fkey";

-- DropForeignKey
ALTER TABLE "devices" DROP CONSTRAINT "devices_site_id_fkey";

-- AlterTable
ALTER TABLE "societies" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "phone_number" SET NOT NULL;

-- AlterTable
ALTER TABLE "vehicle_logs" DROP COLUMN "device_id",
DROP COLUMN "entry_time",
DROP COLUMN "society_id",
DROP COLUMN "vehicle_id";

-- AlterTable
ALTER TABLE "devices" DROP COLUMN "is_active",
DROP COLUMN "society_id",
ALTER COLUMN "site_id" SET NOT NULL;

-- DropTable
DROP TABLE "society_roles";

-- DropTable
DROP TABLE "users_society_roles";

-- DropTable
DROP TABLE "vehicles_devices";

-- DropEnum
DROP TYPE "SocietyRoleName";

-- CreateIndex
CREATE UNIQUE INDEX "societies_email_key" ON "societies"("email" ASC);

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

