/*
  Warnings:

  - The primary key for the `devices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `name` on the `devices` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `type` on the `devices` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - Changed the type of `id` on the `devices` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `device_id` on the `light_switches` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `device_id` on the `thermostats` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "light_switches" DROP CONSTRAINT "light_switches_device_id_fkey";

-- DropForeignKey
ALTER TABLE "thermostats" DROP CONSTRAINT "thermostats_device_id_fkey";

-- AlterTable
ALTER TABLE "devices" DROP CONSTRAINT "devices_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "type" SET DATA TYPE VARCHAR(255),
ADD CONSTRAINT "devices_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "light_switches" ALTER COLUMN "is_on" DROP NOT NULL,
DROP COLUMN "device_id",
ADD COLUMN     "device_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "thermostats" DROP COLUMN "device_id",
ADD COLUMN     "device_id" UUID NOT NULL,
ALTER COLUMN "current_value" DROP NOT NULL,
ALTER COLUMN "target_value" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "light_switches_device_id_key" ON "light_switches"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "thermostats_device_id_key" ON "thermostats"("device_id");

-- AddForeignKey
ALTER TABLE "light_switches" ADD CONSTRAINT "light_switches_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thermostats" ADD CONSTRAINT "thermostats_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
