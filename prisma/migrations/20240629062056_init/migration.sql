-- CreateTable
CREATE TABLE `Admins` (
    `id_admin` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `refresh_token` VARCHAR(191) NOT NULL,
    `ip_address` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Admins_email_key`(`email`),
    PRIMARY KEY (`id_admin`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Animals` (
    `id_animal` INTEGER NOT NULL AUTO_INCREMENT,
    `local_name` VARCHAR(191) NOT NULL,
    `latin_name` VARCHAR(191) NOT NULL,
    `habitat` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `city` VARCHAR(191) NOT NULL,
    `longitude` VARCHAR(191) NOT NULL,
    `latitude` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_animal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HistoryRequestDatas` (
    `id_history_request_data` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `profession` VARCHAR(191) NOT NULL,
    `instances` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `body` VARCHAR(191) NOT NULL,
    `id_send_data` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `date` DATETIME(3) NULL,

    PRIMARY KEY (`id_history_request_data`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Otps` (
    `id_otp` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NULL,
    `otp` VARCHAR(191) NULL,
    `expired_at` DATETIME(3) NULL,
    `used` INTEGER NOT NULL,

    PRIMARY KEY (`id_otp`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RequestAccounts` (
    `id_request_account` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `profession` VARCHAR(191) NOT NULL,
    `instances` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `body` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `approve` INTEGER NOT NULL,

    PRIMARY KEY (`id_request_account`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RequestDatas` (
    `id_request_data` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `profession` VARCHAR(191) NOT NULL,
    `instances` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `body` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `approve` INTEGER NOT NULL,
    `id_user` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_request_data`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SendDatas` (
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
    `date_start` DATETIME(3) NOT NULL,
    `date_end` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_send_data`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `picture` VARCHAR(191) NULL,
    `refresh_token` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,
    `status` INTEGER NULL,
    `ip_address` INTEGER NULL,

    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Animals` ADD CONSTRAINT `Animals_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `Users`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistoryRequestDatas` ADD CONSTRAINT `HistoryRequestDatas_id_send_data_fkey` FOREIGN KEY (`id_send_data`) REFERENCES `SendDatas`(`id_send_data`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HistoryRequestDatas` ADD CONSTRAINT `HistoryRequestDatas_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `Users`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RequestDatas` ADD CONSTRAINT `RequestDatas_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `Users`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
