-- AlterTable
ALTER TABLE "residents_flats" ADD COLUMN     "is_primary" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users_society_roles" ADD COLUMN     "is_primary" BOOLEAN NOT NULL DEFAULT false;
