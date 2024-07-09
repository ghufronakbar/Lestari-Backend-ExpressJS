-- AlterTable
ALTER TABLE "Admins" ALTER COLUMN "refresh_token" DROP NOT NULL,
ALTER COLUMN "ip_address" DROP NOT NULL;
