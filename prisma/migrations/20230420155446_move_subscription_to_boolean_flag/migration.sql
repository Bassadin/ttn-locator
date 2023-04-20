/*
  Warnings:

  - You are about to drop the `DeviceSubscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DeviceSubscription" DROP CONSTRAINT "DeviceSubscription_deviceId_fkey";

-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "subscription" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "DeviceSubscription";
