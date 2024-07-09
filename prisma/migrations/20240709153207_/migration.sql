-- CreateTable
CREATE TABLE "Admins" (
    "id_admin" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL,

    CONSTRAINT "Admins_pkey" PRIMARY KEY ("id_admin")
);

-- CreateTable
CREATE TABLE "Animals" (
    "id_animal" SERIAL NOT NULL,
    "local_name" TEXT NOT NULL,
    "latin_name" TEXT NOT NULL,
    "habitat" TEXT NOT NULL,
    "description" TEXT,
    "city" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,
    "date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Animals_pkey" PRIMARY KEY ("id_animal")
);

-- CreateTable
CREATE TABLE "History_Request_Datas" (
    "id_history_request_data" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "instances" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "id_send_data" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,
    "date" TIMESTAMP(3),

    CONSTRAINT "History_Request_Datas_pkey" PRIMARY KEY ("id_history_request_data")
);

-- CreateTable
CREATE TABLE "Otps" (
    "id_otp" SERIAL NOT NULL,
    "email" TEXT,
    "otp" TEXT,
    "expired_at" TIMESTAMP(3),
    "used" INTEGER NOT NULL,

    CONSTRAINT "Otps_pkey" PRIMARY KEY ("id_otp")
);

-- CreateTable
CREATE TABLE "Request_Accounts" (
    "id_request_account" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "instances" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "approve" INTEGER NOT NULL,

    CONSTRAINT "Request_Accounts_pkey" PRIMARY KEY ("id_request_account")
);

-- CreateTable
CREATE TABLE "Request_Datas" (
    "id_request_data" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "instances" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approve" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Request_Datas_pkey" PRIMARY KEY ("id_request_data")
);

-- CreateTable
CREATE TABLE "Send_Datas" (
    "id_send_data" SERIAL NOT NULL,
    "local_name" INTEGER NOT NULL,
    "latin_name" INTEGER NOT NULL,
    "habitat" INTEGER NOT NULL,
    "description" INTEGER NOT NULL,
    "city" INTEGER NOT NULL,
    "longitude" INTEGER NOT NULL,
    "latitude" INTEGER NOT NULL,
    "image" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "date_start" DATE NOT NULL,
    "date_end" DATE NOT NULL,

    CONSTRAINT "Send_Datas_pkey" PRIMARY KEY ("id_send_data")
);

-- CreateTable
CREATE TABLE "Users" (
    "id_user" SERIAL NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "phone" TEXT,
    "password" TEXT,
    "picture" TEXT,
    "refresh_token" TEXT,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "status" INTEGER,
    "ip_address" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id_user")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admins_email_key" ON "Admins"("email");

-- AddForeignKey
ALTER TABLE "Animals" ADD CONSTRAINT "Animals_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "Users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History_Request_Datas" ADD CONSTRAINT "History_Request_Datas_id_send_data_fkey" FOREIGN KEY ("id_send_data") REFERENCES "Send_Datas"("id_send_data") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History_Request_Datas" ADD CONSTRAINT "History_Request_Datas_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "Users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request_Datas" ADD CONSTRAINT "Request_Datas_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "Users"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
