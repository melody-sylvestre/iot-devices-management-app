/*
  Warnings:

  - The primary key for the `light_switches` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `light_switches` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[device_id]` on the table `light_switches` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `device_id` to the `light_switches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "light_switches" DROP CONSTRAINT "light_switches_pkey",
DROP COLUMN "id",
ADD COLUMN     "device_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "thermostats" (
    "device_id" TEXT NOT NULL,
    "current_value" DOUBLE PRECISION NOT NULL,
    "target_value" DOUBLE PRECISION NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "thermostats_device_id_key" ON "thermostats"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "light_switches_device_id_key" ON "light_switches"("device_id");

-- AddForeignKey
ALTER TABLE "light_switches" ADD CONSTRAINT "light_switches_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thermostats" ADD CONSTRAINT "thermostats_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
