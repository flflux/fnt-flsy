-- CreateTable
CREATE TABLE "device_images" (
    "id" SERIAL NOT NULL,
    "image" BYTEA NOT NULL,
    "device_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "device_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "device_images" ADD CONSTRAINT "device_images_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
