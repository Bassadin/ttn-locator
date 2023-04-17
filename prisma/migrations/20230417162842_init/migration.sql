-- CreateTable
CREATE TABLE "TtnMapperDatapoint" (
    "id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "deviceGPSDatapointId" INTEGER NOT NULL,
    "gatewayId" TEXT NOT NULL,
    "rssi" INTEGER NOT NULL,
    "snr" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TtnMapperDatapoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceGPSDatapoint" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL,
    "deviceId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "altitude" DOUBLE PRECISION NOT NULL,
    "hdop" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DeviceGPSDatapoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "deviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("deviceId")
);

-- CreateTable
CREATE TABLE "Gateway" (
    "gatewayId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "altitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gateway_pkey" PRIMARY KEY ("gatewayId")
);

-- CreateTable
CREATE TABLE "DeviceSubscription" (
    "deviceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceSubscription_pkey" PRIMARY KEY ("deviceId")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeviceGPSDatapoint_deviceId_timestamp_key" ON "DeviceGPSDatapoint"("deviceId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceSubscription_deviceId_key" ON "DeviceSubscription"("deviceId");

-- AddForeignKey
ALTER TABLE "TtnMapperDatapoint" ADD CONSTRAINT "TtnMapperDatapoint_deviceGPSDatapointId_fkey" FOREIGN KEY ("deviceGPSDatapointId") REFERENCES "DeviceGPSDatapoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TtnMapperDatapoint" ADD CONSTRAINT "TtnMapperDatapoint_gatewayId_fkey" FOREIGN KEY ("gatewayId") REFERENCES "Gateway"("gatewayId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceGPSDatapoint" ADD CONSTRAINT "DeviceGPSDatapoint_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("deviceId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceSubscription" ADD CONSTRAINT "DeviceSubscription_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("deviceId") ON DELETE RESTRICT ON UPDATE CASCADE;
