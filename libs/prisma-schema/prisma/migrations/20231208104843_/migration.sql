/*
  Warnings:

  - You are about to drop the column `entry_time` on the `vehicle_logs` table. All the data in the column will be lost.
  - Added the required column `date_time` to the `vehicle_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vehicle_logs" DROP COLUMN "entry_time",
ADD COLUMN     "date_time" TIMESTAMPTZ NOT NULL;
