/*
  Warnings:

  - Added the required column `entry_time` to the `vehicle_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vehicle_logs" ADD COLUMN     "entry_time" TIMESTAMPTZ NOT NULL;
