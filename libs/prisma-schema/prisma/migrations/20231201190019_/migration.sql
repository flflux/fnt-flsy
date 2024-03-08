-- CreateEnum
CREATE TYPE "SuperRoleName" AS ENUM ('ADMIN');

-- CreateEnum
CREATE TYPE "OrganizationRoleName" AS ENUM ('ADMIN');

-- CreateEnum
CREATE TYPE "SocietyRoleName" AS ENUM ('ADMIN');

-- CreateEnum
CREATE TYPE "ResidentType" AS ENUM ('OWNER', 'FAMILY_MEMBER', 'TENANT');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('TWO_WHEELER', 'FOUR_WHEELER', 'OTHER');

-- CreateEnum
CREATE TYPE "AccessDirection" AS ENUM ('IN', 'OUT');

-- CreateEnum
CREATE TYPE "AccessStatus" AS ENUM ('ALLOW', 'DISALLOW');

-- CreateEnum
CREATE TYPE "SyncMessageCardAction" AS ENUM ('ADD', 'REMOVE');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('ACCESS', 'MONCON');

-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('RFID', 'FASTAG');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "address_line_1" TEXT NOT NULL,
    "address_line_2" TEXT,
    "city" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "state_code" TEXT,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_groups" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "organization_id" INTEGER NOT NULL,

    CONSTRAINT "site_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sites" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "site_group_id" INTEGER NOT NULL,

    CONSTRAINT "sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "super_roles" (
    "id" SERIAL NOT NULL,
    "name" "SuperRoleName" NOT NULL,

    CONSTRAINT "super_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_roles" (
    "id" SERIAL NOT NULL,
    "name" "OrganizationRoleName" NOT NULL,

    CONSTRAINT "organization_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "society_roles" (
    "id" SERIAL NOT NULL,
    "name" "SocietyRoleName" NOT NULL,

    CONSTRAINT "society_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_super_roles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "super_role_id" INTEGER NOT NULL,

    CONSTRAINT "users_super_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_organization_roles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "organization_role_id" INTEGER NOT NULL,
    "organization_id" INTEGER NOT NULL,

    CONSTRAINT "users_organization_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_society_roles" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "society_role_id" INTEGER NOT NULL,
    "society_id" INTEGER NOT NULL,

    CONSTRAINT "users_society_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "societies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address_line_1" TEXT NOT NULL,
    "address_line_2" TEXT,
    "city" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "state_code" TEXT,
    "email" TEXT,
    "phone_number" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "is_active" BOOLEAN NOT NULL,

    CONSTRAINT "societies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "buildings" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "society_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "buildings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "floors" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "building_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "floors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flats" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "floor_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "flats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "residents" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "is_child" BOOLEAN NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "residents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "residents_flats" (
    "id" SERIAL NOT NULL,
    "flat_id" INTEGER NOT NULL,
    "resident_id" INTEGER NOT NULL,
    "type" "ResidentType" NOT NULL,

    CONSTRAINT "residents_flats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "type" "VehicleType" NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cards" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "vehicle_id" INTEGER,
    "is_active" BOOLEAN NOT NULL,
    "type" "CardType" NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles_flats" (
    "id" SERIAL NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "flat_id" INTEGER NOT NULL,

    CONSTRAINT "vehicles_flats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles_devices" (
    "id" SERIAL NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "device_id" INTEGER NOT NULL,

    CONSTRAINT "vehicles_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_logs" (
    "id" SERIAL NOT NULL,
    "status" "AccessStatus" NOT NULL,
    "direction" "AccessDirection" NOT NULL,
    "vehicle_card_id" INTEGER NOT NULL,
    "society_id" INTEGER NOT NULL,
    "device_id" INTEGER NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vehicle_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" SERIAL NOT NULL,
    "device_id" TEXT NOT NULL,
    "device_key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "thing_id" TEXT NOT NULL,
    "thing_key" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "last_sync_timestamp" INTEGER NOT NULL,
    "is_device_key_exempt" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "is_active" BOOLEAN NOT NULL,
    "type" "DeviceType" NOT NULL,
    "site_id" INTEGER,
    "society_id" INTEGER,
    "device_bank_id" INTEGER,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_cards" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "card_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "device_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "i_am_here_logs" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "i_am_here_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_messages" (
    "id" SERIAL NOT NULL,
    "sync_token" TEXT NOT NULL,
    "device_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sync_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_message_cards" (
    "id" SERIAL NOT NULL,
    "sync_message_id" INTEGER NOT NULL,
    "access_display" TEXT NOT NULL,
    "status" "SyncMessageCardAction" NOT NULL,

    CONSTRAINT "sync_message_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sync_ack_logs" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sync_ack_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_paramaters" (
    "id" SERIAL NOT NULL,
    "device_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "lower_limit" INTEGER,
    "upper_limit" INTEGER,
    "type" "DeviceType" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,

    CONSTRAINT "device_paramaters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CardToDevice" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_email_key" ON "organizations"("email");

-- CreateIndex
CREATE UNIQUE INDEX "super_roles_name_key" ON "super_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "organization_roles_name_key" ON "organization_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "society_roles_name_key" ON "society_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "residents_email_key" ON "residents"("email");

-- CreateIndex
CREATE UNIQUE INDEX "residents_phone_number_key" ON "residents"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "residents_flats_flat_id_resident_id_key" ON "residents_flats"("flat_id", "resident_id");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_number_key" ON "vehicles"("number");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_flats_vehicle_id_flat_id_key" ON "vehicles_flats"("vehicle_id", "flat_id");

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_devices_vehicle_id_device_id_key" ON "vehicles_devices"("vehicle_id", "device_id");

-- CreateIndex
CREATE UNIQUE INDEX "devices_device_id_key" ON "devices"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "device_cards_device_id_card_id_key" ON "device_cards"("device_id", "card_id");

-- CreateIndex
CREATE UNIQUE INDEX "sync_messages_device_id_sync_token_key" ON "sync_messages"("device_id", "sync_token");

-- CreateIndex
CREATE UNIQUE INDEX "device_paramaters_device_id_key" ON "device_paramaters"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "_CardToDevice_AB_unique" ON "_CardToDevice"("A", "B");

-- CreateIndex
CREATE INDEX "_CardToDevice_B_index" ON "_CardToDevice"("B");

-- AddForeignKey
ALTER TABLE "site_groups" ADD CONSTRAINT "site_groups_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sites" ADD CONSTRAINT "sites_site_group_id_fkey" FOREIGN KEY ("site_group_id") REFERENCES "site_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_super_roles" ADD CONSTRAINT "users_super_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_super_roles" ADD CONSTRAINT "users_super_roles_super_role_id_fkey" FOREIGN KEY ("super_role_id") REFERENCES "super_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_organization_roles" ADD CONSTRAINT "users_organization_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_organization_roles" ADD CONSTRAINT "users_organization_roles_organization_role_id_fkey" FOREIGN KEY ("organization_role_id") REFERENCES "organization_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_organization_roles" ADD CONSTRAINT "users_organization_roles_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_society_roles" ADD CONSTRAINT "users_society_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_society_roles" ADD CONSTRAINT "users_society_roles_society_role_id_fkey" FOREIGN KEY ("society_role_id") REFERENCES "society_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_society_roles" ADD CONSTRAINT "users_society_roles_society_id_fkey" FOREIGN KEY ("society_id") REFERENCES "societies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buildings" ADD CONSTRAINT "buildings_society_id_fkey" FOREIGN KEY ("society_id") REFERENCES "societies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "floors" ADD CONSTRAINT "floors_building_id_fkey" FOREIGN KEY ("building_id") REFERENCES "buildings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flats" ADD CONSTRAINT "flats_floor_id_fkey" FOREIGN KEY ("floor_id") REFERENCES "floors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "residents_flats" ADD CONSTRAINT "residents_flats_flat_id_fkey" FOREIGN KEY ("flat_id") REFERENCES "flats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "residents_flats" ADD CONSTRAINT "residents_flats_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "residents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles_flats" ADD CONSTRAINT "vehicles_flats_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles_flats" ADD CONSTRAINT "vehicles_flats_flat_id_fkey" FOREIGN KEY ("flat_id") REFERENCES "flats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles_devices" ADD CONSTRAINT "vehicles_devices_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicles_devices" ADD CONSTRAINT "vehicles_devices_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_logs" ADD CONSTRAINT "vehicle_logs_vehicle_card_id_fkey" FOREIGN KEY ("vehicle_card_id") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_logs" ADD CONSTRAINT "vehicle_logs_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_logs" ADD CONSTRAINT "vehicle_logs_society_id_fkey" FOREIGN KEY ("society_id") REFERENCES "societies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_logs" ADD CONSTRAINT "vehicle_logs_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "vehicles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_society_id_fkey" FOREIGN KEY ("society_id") REFERENCES "societies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_cards" ADD CONSTRAINT "device_cards_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "i_am_here_logs" ADD CONSTRAINT "i_am_here_logs_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sync_messages" ADD CONSTRAINT "sync_messages_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sync_message_cards" ADD CONSTRAINT "sync_message_cards_sync_message_id_fkey" FOREIGN KEY ("sync_message_id") REFERENCES "sync_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sync_ack_logs" ADD CONSTRAINT "sync_ack_logs_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_paramaters" ADD CONSTRAINT "device_paramaters_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToDevice" ADD CONSTRAINT "_CardToDevice_A_fkey" FOREIGN KEY ("A") REFERENCES "cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardToDevice" ADD CONSTRAINT "_CardToDevice_B_fkey" FOREIGN KEY ("B") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
