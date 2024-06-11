'use strict';

const response = require('../../res');
var connection = require('../../connection');
var md5 = require('md5');
const nodemailer = require("nodemailer");
require('dotenv').config()


exports.index = function (req, res) {
    response.ok("REST API Worked!", res)
}

//GET REQUEST DATAS
exports.webrequestdatas = function (req, res) {
    connection.query(`SELECT * FROM request_datas`,
        function (error, rows, fields) {
            if (error) {
                connection.log(error);
            } else {
                response.ok(rows, res)
            };
        }
    )
};


//GET ID REQUEST DATA
exports.webrequestdataid = function (req, res) {
    let id = req.params.id
    connection.query(`SELECT * FROM request_datas WHERE id_request_data=?`, [id],
        function (error, rows, fields) {
            if (error) {
                connection.log(error);
            } else {
                response.ok(rows, res)
            };
        }
    )
};

//APPROVE REQUEST DATA
exports.webapproverequestdata = function (req, res) {
    let approve = req.body.approve;
    let id = req.params.id;

    if (approve == 1) {
        connection.query(`UPDATE request_datas SET approve=1 WHERE id_request_data=?`,
            [id],
            function (error, rows, fields) {
                if (error) {
                    console.log(error);
                } else {
                    connection.query(`SELECT * FROM request_datas WHERE id_request_data=?`, [id],
                        function (error, results, fields) {
                            if (error) {
                                console.log(error)
                            } else {
                                let email = results[0].email

                                const transporter = nodemailer.createTransport({
                                    service: 'gmail',
                                    host: "smtp@gmail.com",
                                    port: 587,
                                    secure: false,
                                    auth: {
                                        user: process.env.EMAIL,
                                        pass: process.env.PASSWORD,
                                    },
                                });

                                const msg = {
                                    from: '"Lestari" <main@lestari.com>', // sender address
                                    to: `${email}`, // list of receivers
                                    subject: "Data Datwa Liar", // Subject line                                                                    
                                    html: `
                                                                                <!DOCTYPE html>
                                                                                <html lang="en">
                                                                                <head>
                                                                                    <meta charset="UTF-8">
                                                                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                                                                    <title>Informasi Pengiriman Data Konservasi Satwa dari Lestari</title>
                                                                                    <style>
                                                                                        /* Style email content */
                                                                                        body {
                                                                                            font-family: Arial, sans-serif;
                                                                                            line-height: 1.6;
                                                                                        }
                                                                                        .container {
                                                                                            max-width: 600px;
                                                                                            margin: auto;
                                                                                            padding: 20px;
                                                                                            border: 1px solid #ccc;
                                                                                            border-radius: 5px;
                                                                                            background-color: #f9f9f9;
                                                                                        }
                                                                                        h1 {
                                                                                            color: #333;
                                                                                        }
                                                                                        p {
                                                                                            color: #666;
                                                                                        }
                                                                                        .button {
                                                                                            display: inline-block;
                                                                                            padding: 10px 20px;
                                                                                            background-color: #4CAF50;
                                                                                            color: white;
                                                                                            text-decoration: none;
                                                                                            border-radius: 5px;
                                                                                        }
                                                                                    </style>
                                                                                </head>
                                                                                <body>
                                                                                    <div class="container">
                                                                                        <h1>Informasi Pengiriman Data Konservasi Satwa dari Instansi Lestari</h1>
                                                                                        <p>Salam sejahtera,</p>
                                                                                        <p>Kami dari Instansi Lestari ingin memberitahu Anda bahwa data konservasi satwa yang Anda minta tidak dapat kami kirimkan karena suatu hal.</p>                                                                           
                                                                                        <p>Terima kasih telah menggunakan layanan kami. Jika Anda memiliki pertanyaan lebih lanjut, jangan ragu untuk menghubungi kami di nomor yang tercantum di bawah ini atau melalui email.</p>
                                                                                        <p>Salam hormat,</p>
                                                                                        <p>Tim Lestari</p>
                                                                                        <p>Contact: ${process.env.EMAIL} | Phone: <a href="${process.env.PHONE_WA}">${process.env.PHONE_FORMATTED}</a>  </p>  
                                                                                    </div>
                                                                                </body>
                                                                                </html>
                                                                                
                                                        `
                                }
                                // async..await is not allowed in global scope, must use a wrapper
                                async function main() {
                                    // send mail with defined transport object
                                    const info = await transporter.sendMail(msg);

                                    // console.log("Message sent: %s", info.messageId);
                                    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
                                }
                                main().catch(console.error);
                                response.ok(rows, res)
                            }


                        }
                    )


                }
            });
    } else if (approve == 2) {
        connection.query(`UPDATE request_datas SET approve=2 WHERE id_request_data=?`,
            [id],
            function (error, rows, fields) {
                if (error) {
                    console.log(error);
                } else {
                    response.ok(rows, res)
                }
            });
    }
};

//SEND REQUEST DATA
exports.websendrequestdata = function (req, res) {
    let local_name = req.body.local_name;
    let latin_name = req.body.latin_name;
    let habitat = req.body.habitat;
    let description = req.body.description;
    let city = req.body.city;
    let longitude = req.body.longitude;
    let latitude = req.body.latitude;
    let image = req.body.image;
    let amount = req.body.amount;
    let date_start = req.body.date_start;
    let date_end = req.body.date_end;
    let id_request_data = req.body.id_request_data;

    connection.query(`INSERT INTO send_datas 
                        (local_name, latin_name, habitat, description,
                        city, longitude, latitude, image, amount,
                        date_start, date_end) VALUES(?,?,?,?,?,?,?,?,?,?,?)`,
        [local_name, latin_name, habitat, description, city,
            longitude, latitude, image, amount, date_start, date_end],
        function (error, result, fields) {
            if (error) {
                console.log(error);
                res.status(500).send("Failed to insert data into send_datas");
            } else {
                // Langkah 2: Ambil id_send_data terbaru
                connection.query('SELECT MAX(id_send_data) AS max_id FROM send_datas', function (error, response, fields) {
                    if (error) {
                        console.log(error);
                        res.status(500).send("Failed to retrieve max id_send_data");
                    } else {
                        let id_send_data = response[0].max_id;

                        // Langkah 3: Ambil data dari request_datas
                        connection.query(`SELECT * FROM request_datas WHERE id_request_data=?`, [id_request_data], function (error, results, fields) {
                            if (error) {
                                console.log(error);
                                res.status(500).send("Failed to retrieve data from request_datas");
                            } else {
                                if (results.length > 0) {
                                    let name = results[0].name;
                                    let email = results[0].email;
                                    let profession = results[0].profession;
                                    let instances = results[0].instances;
                                    let subject = results[0].subject;
                                    let body = results[0].body;
                                    let id_user = results[0].id_user;
                                    let now = new Date();
                                    let datetimenow = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2) + ' ' +
                                        ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2) + ':' + ('0' + now.getSeconds()).slice(-2);

                                    // Langkah 4: Masukkan data ke dalam history_request_datas
                                    connection.query(`INSERT INTO history_request_datas
                                                        (email, name, profession, instances, subject, body, id_user, id_send_data,date)
                                                        VALUES(?,?,?,?,?,?,?,?,?)`,
                                        [email, name, profession, instances, subject, body, id_user, id_send_data, datetimenow],
                                        function (error, rows, fields) {
                                            if (error) {
                                                console.log(error);
                                                res.status(500).send("Failed to insert data into history_request_datas");
                                            } else {

                                                // Langkah 5: Buat file CSV dan simpan ke dalam direktori 'data'
                                                // Array untuk menyimpan nama kolom yang dipilih
                                                let selectedFields = [];

                                                if (local_name == 1) { selectedFields.push("local_name"); }
                                                if (latin_name == 1) { selectedFields.push("latin_name"); }
                                                if (habitat == 1) { selectedFields.push("habitat"); }
                                                if (description == 1) { selectedFields.push("description"); }
                                                if (city == 1) { selectedFields.push("city"); }
                                                if (longitude == 1) { selectedFields.push("longitude"); }
                                                if (latitude == 1) { selectedFields.push("latitude"); }
                                                if (image == 1) { selectedFields.push("image"); }
                                                if (amount == 1) { selectedFields.push("amount"); }

                                                // Menggabungkan array selectedFields menjadi string dengan menggunakan method join
                                                let selectedFieldsString = selectedFields.join(", ");

                                                let query_filtering = `SELECT ${selectedFieldsString} FROM animals WHERE date >= '${date_start}' AND date <= '${date_end}'`;

                                                connection.query(query_filtering, function (error, rows, fields) {
                                                    if (error) {
                                                        console.log(error);
                                                        res.status(500).send("Failed to fetch data from animals table");
                                                    } else {

                                                        // Memeriksa apakah ada baris yang tampil dalam hasil query
                                                        if (rows.length === 0) {
                                                            res.status(400).send("There's no data in range");
                                                        } else {
                                                            let result = []
                                                            rows.forEach(row => {
                                                                result.push({
                                                                    local_name: row.local_name,
                                                                    latin_name: row.latin_name,
                                                                    habitat: row.habitat,
                                                                    description: row.description,
                                                                    city: row.city,
                                                                    longitude: row.longitude,
                                                                    latitude: row.latitude,
                                                                    amount: row.amount,
                                                                    image: row.image ? process.env.BASE_URL + `/v1/mob/image/animal/` + row.image : process.env.BASE_URL + `/v1/mob/image/default/picture.webp`,
                                                                })
                                                            });
                                                            // Header CSV
                                                            let csv = Object.keys(rows[0]).join(',') + '\n';

                                                            // Data CSV
                                                            result.forEach(row => {
                                                                let values = Object.values(row);
                                                                csv += values.map(value => {
                                                                    // Mengapa kita memeriksa tipe data? Karena jika nilai itu string dan mungkin mengandung koma, kita perlu mengapitnya dengan tanda kutip
                                                                    return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
                                                                }).join(',') + '\n';
                                                            });

                                                            const fs = require('fs');
                                                            const path = require('path');
                                                            const rootDir = process.cwd(); // Mendapatkan direktori kerja saat ini
                                                            const dataDir = path.join(rootDir, 'upload/data'); // Menggabungkan dengan direktori 'data'

                                                            let nowFile = new Date();

                                                            // Mendapatkan tanggal, bulan, dan tahun saat ini
                                                            let yearFile = now.getFullYear();
                                                            let monthFile = (nowFile.getMonth() + 1).toString().padStart(2, '0'); // Tambah 1 karena bulan dimulai dari 0
                                                            let dateFile = nowFile.getDate().toString().padStart(2, '0');

                                                            // Format tanggal sesuai dengan format yang diinginkan (yyyyMMdd)
                                                            let formattedDate = `${yearFile}${monthFile}${dateFile}`;
                                                            // Nama file berdasarkan variabel yang Anda sediakan
                                                            const fileName = `${id_send_data}_${name}_${formattedDate}.csv`;
                                                            const filePath = path.join(dataDir, fileName); // Gabungkan dengan nama file untuk mendapatkan path lengkap                                                        

                                                            // Menyimpan data CSV ke file
                                                            fs.writeFile(filePath, csv, (err) => {
                                                                if (err) {
                                                                    console.error('Gagal menyimpan file:', err);
                                                                    res.status(500).send("Failed to save CSV file");
                                                                } else {
                                                                    console.log(`File CSV berhasil disimpan di ${filePath}`);

                                                                    // Membuat URL file CSV
                                                                    const fileURL = `${process.env.BASE_URL}/v1/mob/data/${fileName}`; // Gunakan path relatif

                                                                    let day = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][now.getDay()];
                                                                    let month = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][now.getMonth()];

                                                                    let formattedDateTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${day}, ${now.getDate()} ${month} ${now.getFullYear()}`;

                                                                    const transporter = nodemailer.createTransport({
                                                                        service: 'gmail',
                                                                        host: "smtp@gmail.com",
                                                                        port: 587,
                                                                        secure: false,
                                                                        auth: {
                                                                            user: process.env.EMAIL,
                                                                            pass: process.env.PASSWORD,
                                                                        },
                                                                    });

                                                                    const msg = {
                                                                        from: '"Lestari" <main@lestari.com>', // sender address
                                                                        to: `${email}`, // list of receivers
                                                                        subject: "Data Datwa Liar", // Subject line                                                                    
                                                                        html: `
                                                                    <!DOCTYPE html>
                                                                    <html lang="en">
                                                                    <head>
                                                                        <meta charset="UTF-8">
                                                                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                                                        <title>Informasi Pengiriman Data Konservasi Satwa dari Lestari</title>
                                                                        <style>
                                                                            /* Style email content */
                                                                            body {
                                                                                font-family: Arial, sans-serif;
                                                                                line-height: 1.6;
                                                                            }
                                                                            .container {
                                                                                max-width: 600px;
                                                                                margin: auto;
                                                                                padding: 20px;
                                                                                border: 1px solid #ccc;
                                                                                border-radius: 5px;
                                                                                background-color: #f9f9f9;
                                                                            }
                                                                            h1 {
                                                                                color: #333;
                                                                            }
                                                                            p {
                                                                                color: #666;
                                                                            }
                                                                            .button {
                                                                                display: inline-block;
                                                                                padding: 10px 20px;
                                                                                background-color: #4CAF50;
                                                                                color: white;
                                                                                text-decoration: none;
                                                                                border-radius: 5px;
                                                                            }
                                                                        </style>
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
                                                                            <p>Contact: ${process.env.EMAIL} | Phone: <a href="${process.env.PHONE_WA}">${process.env.PHONE_FORMATTED}</a>  </p>
                                                                    
                                                                            <a href="${fileURL}" class="button">Unduh Data</a>
                                                                           
                                                                        </div>
                                                                    </body>
                                                                    </html>
                                                                    
                                            `
                                                                    }
                                                                    // async..await is not allowed in global scope, must use a wrapper
                                                                    async function main() {
                                                                        // send mail with defined transport object
                                                                        const info = await transporter.sendMail(msg);

                                                                        // console.log("Message sent: %s", info.messageId);
                                                                        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
                                                                    }
                                                                    main().catch(console.error);
                                                                    // Menyimpan URL ke dalam tabel request_datas
                                                                    connection.query(`UPDATE request_datas SET url = ? WHERE id_request_data = ?`, [fileName, id_request_data], (error, result, fields) => {
                                                                        if (error) {
                                                                            console.log("Gagal menyimpan URL ke dalam tabel history_request_datas:", error);
                                                                            res.status(500).send("Failed to update URL in history_request_datas table");
                                                                        } else {
                                                                            console.log("URL berhasil disimpan di tabel request_datas");

                                                                            // Sisipkan kode pengiriman email di sini jika diperlukan
                                                                            res.status(200).send("Data telah berhasil dikirim dan URL CSV telah disimpan.");
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    }

                                                });
                                            }
                                        });
                                } else {
                                    res.status(404).send("No data found for the specified ID.");
                                }
                            }
                        });
                    }
                });
            }
        });
};
