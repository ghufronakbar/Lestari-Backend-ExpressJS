/*
  Warnings:

  - You are about to drop the `historyrequestdatas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `requestaccounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `requestdatas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `senddatas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `historyrequestdatas` DROP FOREIGN KEY `HistoryRequestDatas_id_send_data_fkey`;

-- DropForeignKey
ALTER TABLE `historyrequestdatas` DROP FOREIGN KEY `HistoryRequestDatas_id_user_fkey`;

-- DropForeignKey
ALTER TABLE `requestdatas` DROP FOREIGN KEY `RequestDatas_id_user_fkey`;

-- DropTable
DROP TABLE `historyrequestdatas`;

-- DropTable
DROP TABLE `requestaccounts`;

-- DropTable
DROP TABLE `requestdatas`;

-- DropTable
DROP TABLE `senddatas`;

-- CreateTable
CREATE TABLE `History_Request_Datas` (
    `id_history_request_data` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `profession` VARCHAR(191) NOT NULL,
    `instances` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `body` TEXT NOT NULL,
    `id_send_data` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `date` DATETIME(3) NULL,

    PRIMARY KEY (`id_history_request_data`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Request_Accounts` (
    `id_request_account` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `profession` VARCHAR(191) NOT NULL,
    `instances` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `body` TEXT NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `approve` INTEGER NOT NULL,

    PRIMARY KEY (`id_request_account`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Request_Datas` (
    `id_request_data` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `profession` VARCHAR(191) NOT NULL,
    `instances` VARCHAR(191) NOT NULL,
    `subject` TEXT NOT NULL,
    `body` TEXT NOT NULL,
    `date` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `approve` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_request_data`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Send_Datas` (
    `id_send_data` INTEGER NOT NULL AUTO_INCREMENT,
    `local_name` INTEGER NOT NULL,
    `latin_name` INTEGER NOT NULL,
    `habitat` INTEGER NOT NULL,
    `description` INTEGER NOT NULL,
    `city` INTEGER NOT NULL,
    `longitude` INTEGER NOT NULL,
    `latitude` INTEGER NOT NULL,
    `image` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `date_start` DATE NOT NULL,
    `date_end` DATE NOT NULL,

    PRIMARY KEY (`id_send_data`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `History_Request_Datas` ADD CONSTRAINT `History_Request_Datas_id_send_data_fkey` FOREIGN KEY (`id_send_data`) REFERENCES `Send_Datas`(`id_send_data`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `History_Request_Datas` ADD CONSTRAINT `History_Request_Datas_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `Users`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Request_Datas` ADD CONSTRAINT `Request_Datas_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `Users`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
