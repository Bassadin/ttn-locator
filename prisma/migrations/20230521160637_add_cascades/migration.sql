-- DropForeignKey
ALTER TABLE "DeviceGPSDatapoint" DROP CONSTRAINT "DeviceGPSDatapoint_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "TtnMapperDatapoint" DROP CONSTRAINT "TtnMapperDatapoint_deviceGPSDatapointId_fkey";

-- DropForeignKey
ALTER TABLE "TtnMapperDatapoint" DROP CONSTRAINT "TtnMapperDatapoint_gatewayId_fkey";

-- AddForeignKey
ALTER TABLE "TtnMapperDatapoint" ADD CONSTRAINT "TtnMapperDatapoint_deviceGPSDatapointId_fkey" FOREIGN KEY ("deviceGPSDatapointId") REFERENCES "DeviceGPSDatapoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TtnMapperDatapoint" ADD CONSTRAINT "TtnMapperDatapoint_gatewayId_fkey" FOREIGN KEY ("gatewayId") REFERENCES "Gateway"("gatewayId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceGPSDatapoint" ADD CONSTRAINT "DeviceGPSDatapoint_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("deviceId") ON DELETE CASCADE ON UPDATE CASCADE;
