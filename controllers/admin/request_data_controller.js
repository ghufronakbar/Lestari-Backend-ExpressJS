'use strict';

const nodemailer = require("nodemailer");
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const email_style = require('../../lib/email_style');


const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const msg = {
        from: '"Lestari" <main@lestari.com>',
        to,
        subject,
        html,
    };

    try {
        await transporter.sendMail(msg);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

exports.webrequestdatas = async (req, res) => {
    try {
        let { page, search, date_start, date_end } = req.query
        if (search === undefined || search === '') { search = '' }
        page = parseInt(page)
        if (page === undefined || isNaN(page)) { page = 1 }

        const where = {
            OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { profession: { contains: search, mode: 'insensitive' } },
                { instances: { contains: search, mode: 'insensitive' } },
                { subject: { contains: search, mode: 'insensitive' } },
            ]
        }

        if (date_start && date_end) {
            where.date = {
                gte: new Date(date_start),
                lte: new Date(date_end)
            };
        } else if (date_start) {
            where.date = {
                gte: new Date(date_start)
            };
        } else if (date_end) {
            where.date = {
                lte: new Date(date_end)
            };
        }

        const requestDatas = await prisma.request_Datas.findMany({
            skip: (page - 1) * 10,
            take: 10,
            orderBy: {
                id_request_data: 'desc'
            },
            where
        });

        const count = await prisma.request_Datas.count({ where });
        const pagination = {
            page,
            total_page: Math.ceil(count / 10),
            total_data: count,
        }
        return res.status(200).json({ status: 200, pagination, values: requestDatas });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

exports.webrequestdataid = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const requestData = await prisma.request_Datas.findUnique({
            where: { id_request_data: id }
        });

        if (!requestData) {
            return res.status(404).json({ status: 404, message: 'Request data not found' });
        }

        return res.status(200).json({ status: 200, values: [requestData] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};


exports.webapproverequestdata = async (req, res) => {
    const approve = req.body.approve;
    const id = parseInt(req.params.id);

    try {
        if (approve === 1) {
            await prisma.request_Datas.update({
                where: { id_request_data: id },
                data: { approve: 1 }
            });

            const requestData = await prisma.request_Datas.findUnique({
                where: { id_request_data: id }
            });

            const email = requestData.email;
            const htmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Informasi Pengiriman Data Konservasi Satwa dari Lestari</title>
                                                                                                      ${email_style.email_style()}

                </head>
                <body>
                    <div class="container">
                        <h1>Informasi Pengiriman Data Konservasi Satwa dari Instansi Lestari</h1>
                        <p>Salam sejahtera,</p>
                        <p>Kami dari Instansi Lestari ingin memberitahu Anda bahwa data konservasi satwa yang Anda minta tidak dapat kami kirimkan karena suatu hal.</p>                                                                           
                        <p>Terima kasih telah menggunakan layanan kami. Jika Anda memiliki pertanyaan lebih lanjut, jangan ragu untuk menghubungi kami di nomor yang tercantum di bawah ini atau melalui email.</p>
                        <p>Salam hormat,</p>
                        <p>Tim Lestari</p>
                        <p>Contact: ${process.env.EMAIL} | Phone: <a href="${process.env.PHONE_WA}">${process.env.PHONE_FORMATTED}</a></p>  
                    </div>
                </body>
                </html>
            `;

            await sendEmail(email, "Data Datwa Liar", htmlContent);
            return res.status(200).json({ status: 200, message: "Request rejected" });
        } else if (approve === 2) {
            await prisma.request_Datas.update({
                where: { id_request_data: id },
                data: { approve: 2 }
            });
            return res.status(200).json({ status: 200, message: "Request approved" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

exports.websendrequestdata = async (req, res) => {
    const {
        local_name, latin_name, habitat, description, city, longitude,
        latitude, image, amount, date_start, date_end, id_request_data
    } = req.body;

    const { protocol, host } = req;
    const port = ":"+ req.port || process.env.PORT || ""
    const baseUrl = `${protocol}://${host}${port}`


    try {
        // Step 1: Insert data into send_datas
        const sendData = await prisma.send_Datas.create({
            data: {
                local_name, latin_name, habitat, description, city,
                longitude, latitude, image, amount, date_start, date_end
            }
        });

        // Step 2: Get the max id_send_data
        const id_send_data = sendData.id_send_data;

        // Step 3: Get data from request_datas
        const requestData = await prisma.request_Datas.findUnique({
            where: { id_request_data: parseInt(id_request_data) }
        });

        if (!requestData) {
            return res.status(404).send("No data found for the specified ID.");
        }

        const {
            name, email, profession, instances, subject, body, id_user
        } = requestData;
        const now = new Date();
        const datetimenow = now.toISOString()

        // Step 4: Insert data into history_request_datas
        await prisma.history_Request_Datas.create({
            data: {
                email, name, profession, instances, subject, body,
                id_user, id_send_data, date: datetimenow
            }
        });

        // Step 5: Create CSV file and save to 'upload/data' directory
        const selectedFields = [];
        if (local_name) selectedFields.push("local_name");
        if (latin_name) selectedFields.push("latin_name");
        if (habitat) selectedFields.push("habitat");
        if (description) selectedFields.push("description");
        if (city) selectedFields.push("city");
        if (longitude) selectedFields.push("longitude");
        if (latitude) selectedFields.push("latitude");
        if (image) selectedFields.push("image");
        if (amount) selectedFields.push("amount");

        const selectedFieldsString = selectedFields.join(", ");
        const query_filtering = `SELECT ${selectedFieldsString} FROM animals WHERE date >= '${date_start}' AND date <= '${date_end}'`;

        const animalsData = await prisma.$queryRawUnsafe(query_filtering);

        if (animalsData.length === 0) {
            return res.status(400).send("There's no data in range");
        }

        let result = animalsData.map(row => ({
            local_name: row.local_name,
            latin_name: row.latin_name,
            habitat: row.habitat,
            description: row.description,
            city: row.city,
            longitude: row.longitude,
            latitude: row.latitude,
            amount: row.amount,
            image: row.image ? `${baseUrl}/v1/mob/image/animal/${row.image}` : `${baseUrl}/v1/mob/image/default/picture.webp`,
        }));

        // Create CSV
        let csv = selectedFields.join(',') + '\n';
        result.forEach(row => {
            csv += Object.values(row).map(value => (
                typeof value === 'string' && value.includes(',') ? `"${value}"` : value
            )).join(',') + '\n';
        });

        const rootDir = process.cwd();
        const dataDir = path.join(rootDir, 'upload/data');

        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        const formattedDate = now.toISOString().split('T')[0].replace(/-/g, '');
        const fileName = `${id_send_data}_${name}_${formattedDate}.csv`;
        const filePath = path.join(dataDir, fileName);

        fs.writeFileSync(filePath, csv);

        console.log(`File CSV berhasil disimpan di ${filePath}`);
        const fileURL = `${baseUrl}/v1/mob/data/${fileName}`;

        const day = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][now.getDay()];
        const month = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][now.getMonth()];
        const formattedDateTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${day}, ${now.getDate()} ${month} ${now.getFullYear()}`;

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Informasi Pengiriman Data Konservasi Satwa dari Lestari</title>
                                                                                                ${email_style.email_style()}

            </head>
            <body>
                <div class="container">
                    <h1>Informasi Pengiriman Data Konservasi Satwa dari Instansi Lestari</h1>
                    <p>Salam sejahtera,</p>
                    <p>Kami dari Instansi Lestari ingin memberitahu Anda bahwa data konservasi satwa yang Anda minta telah berhasil kami kirimkan. Berikut adalah detail pengiriman:</p>
                    <ul>
                        <li><strong>Tanggal Pengiriman:</strong> ${formattedDateTime}</li>
                        <li><strong>Jenis Data:</strong> Data Konservasi Satwa</li>
                        <li><strong>Metode Pengiriman:</strong> Email</li>
                        <li><strong>Nama Penerima:</strong> ${name}</li>
                        <li><strong>Alamat Email Penerima:</strong> ${email}</li>                                            
                    </ul>
                    <p>Terima kasih telah menggunakan layanan kami. Jika Anda memiliki pertanyaan lebih lanjut, jangan ragu untuk menghubungi kami di nomor yang tercantum di bawah ini atau melalui email.</p>
                    <p>Salam hormat,</p>
                    <p>Tim Lestari</p>
                    <p>Contact: ${process.env.EMAIL} | Phone: <a href="${process.env.PHONE_WA}">${process.env.PHONE_FORMATTED}</a></p>
                    <a href="${fileURL}" class="button">Unduh Data</a>
                </div>
            </body>
            </html>
        `;

        await sendEmail(email, "Data Datwa Liar", htmlContent);

        // Step 6: Update URL in request_datas
        await prisma.request_Datas.update({
            where: { id_request_data: parseInt(id_request_data) },
            data: { url: fileURL }
        });

        return res.status(200).send("Data telah berhasil dikirim dan URL CSV telah disimpan.");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Failed to send request data");
    }
};