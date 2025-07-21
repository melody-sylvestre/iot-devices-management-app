/*
  Warnings:

  - You are about to drop the `light_switches` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `thermostats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "light_switches" DROP CONSTRAINT "light_switches_device_id_fkey";

-- DropForeignKey
ALTER TABLE "thermostats" DROP CONSTRAINT "thermostats_device_id_fkey";

-- AlterTable
ALTER TABLE "devices" ADD COLUMN     "current_value_1" DOUBLE PRECISION,
ADD COLUMN     "is_on" BOOLEAN,
ADD COLUMN     "setting_as_int_scale_1" INTEGER,
ADD COLUMN     "setting_as_string_1" VARCHAR(255),
ADD COLUMN     "target_value_1" DOUBLE PRECISION;

-- DropTable
DROP TABLE "light_switches";

-- DropTable
DROP TABLE "thermostats";
