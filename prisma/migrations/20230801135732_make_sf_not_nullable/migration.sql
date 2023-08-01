/*
  Warnings:

  - Made the column `spreadingFactor` on table `DeviceGPSDatapoint` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DeviceGPSDatapoint" ALTER COLUMN "spreadingFactor" SET NOT NULL;
