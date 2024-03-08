-- AlterTable
ALTER TABLE "users" ADD COLUMN     "token" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
