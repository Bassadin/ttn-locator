-- CreateTable
CREATE TABLE "ttnmapper_datapoint" (
    "id" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "device_gps_datapoint_id" INTEGER NOT NULL,
    "gateway_GatewayEUI" TEXT NOT NULL,
    "rssi" INTEGER NOT NULL,
    "snr" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ttnmapper_datapoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_gps_datapoint" (
    "id" INTEGER NOT NULL,
    "device_dev_id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "altitude" DOUBLE PRECISION NOT NULL,
    "hdop" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "device_gps_datapoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device" (
    "device_id" TEXT NOT NULL,
    "name" VARCHAR(99) NOT NULL,
    "description" VARCHAR(99) NOT NULL,

    CONSTRAINT "device_pkey" PRIMARY KEY ("device_id")
);

-- CreateTable
CREATE TABLE "gateway" (
    "GatewayEUI" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "gateway_pkey" PRIMARY KEY ("GatewayEUI")
);

-- AddForeignKey
ALTER TABLE "ttnmapper_datapoint" ADD CONSTRAINT "ttnmapper_datapoint_device_gps_datapoint_id_fkey" FOREIGN KEY ("device_gps_datapoint_id") REFERENCES "device_gps_datapoint"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ttnmapper_datapoint" ADD CONSTRAINT "ttnmapper_datapoint_gateway_GatewayEUI_fkey" FOREIGN KEY ("gateway_GatewayEUI") REFERENCES "gateway"("GatewayEUI") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_gps_datapoint" ADD CONSTRAINT "device_gps_datapoint_device_dev_id_fkey" FOREIGN KEY ("device_dev_id") REFERENCES "device"("device_id") ON DELETE RESTRICT ON UPDATE CASCADE;
