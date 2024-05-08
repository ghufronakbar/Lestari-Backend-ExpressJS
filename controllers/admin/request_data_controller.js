'use strict';

var response = require('../../res');
var connection = require('../../connection');
var md5 = require('md5');
const nodemailer = require("nodemailer");
const dotenv = require('dotenv').config()


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
                    response.ok(rows, res)
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
                                        let day = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][now.getDay()];
                                        let month = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][now.getMonth()];
                                        
                                        let formattedDateTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} ${day}, ${now.getDate()} ${month} ${now.getFullYear()}`;
                                        
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

                                                
                                                ///////////////

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
                                                    attachment:null,
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
                                                res.status(200).send("Data successfully inserted into history_request_datas");
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
