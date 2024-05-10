'use strict';

var response = require('../../res');
var connection = require('../../connection');
var md5 = require('md5');
const nodemailer = require("nodemailer");
require('dotenv').config()

exports.index = function (req, res) {
    response.ok("REST API Worked!", res)
}

//GET REQUEST ACCOUNTS
exports.webrequestaccounts = function (req, res) {
    connection.query(`SELECT * FROM request_accounts`,
        function (error, rows, fields) {
            if (error) {
                connection.log(error);
            } else {
                response.ok(rows, res)
            };
        }
    )
};

//GET ID REQUEST ACCOUNT
exports.webrequestaccountid = function (req, res) {
    let id = req.params.id
    connection.query(`SELECT * FROM request_accounts WHERE id_request_account=?`, [id],
        function (error, rows, fields) {
            if (error) {
                connection.log(error);
            } else {
                response.ok(rows, res)
            };
        }
    )
};



//PUT APPROVE REQUEST ACCOUNT
exports.webapproverequestaccount = function (req, res) {
    let approve = req.body.approve;
    let id = req.params.id;
    connection.query(`SELECT * FROM request_accounts WHERE id_request_account=?`,[id],
        function (error, result, fields) {
            if (error) {
                console.log(error)
            } else {
                let email = result[0].email
                if (approve == 1) {
                    connection.query(`UPDATE request_accounts SET approve=1 WHERE id_request_account=?`,
                        [id],
                        function (error, rows, fields) {
                            if (error) {
                                console.log(error);
                            } else {

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
                                                                                        <h1>Informasi Pembuatan Akun Konservasi Satwa dari Instansi Lestari</h1>
                                                                                        <p>Salam sejahtera,</p>
                                                                                        <p>Kami dari Instansi Lestari ingin memberitahu Anda bahwa pembuatan akun untuk konservasi satwa yang Anda minta tidak dapat kami kirimkan karena suatu hal.</p>                                                                           
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
                        });
                } else if (approve == 2) {
                    connection.query(`UPDATE request_accounts SET approve=2 WHERE id_request_account=?`,
                        [id],
                        function (error, rows, fields) {
                            if (error) {
                                console.log(error);
                            } else {
                                connection.query(`SELECT * FROM request_accounts WHERE id_request_account=?`, [id], function (error, results, fields) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        if (results.length > 0) {
                                            let email = results[0].email;
                                            let name = results[0].name;
                                            let phone = results[0].phone;
                                            let password = md5(results[0].phone); // Menggunakan nomor telepon sebagai password (tidak disarankan, hanya untuk contoh)
                                            let now = new Date();
                                            let datetimenow = now.getFullYear() + '-' + ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2) + ' ' +
                                                ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2) + ':' + ('0' + now.getSeconds()).slice(-2);

                                            connection.query(`INSERT INTO users (email, name, phone, password, picture, created_at, updated_at, status)
                            VALUES (?, ?, ?, ?, NULL, ?, ?, 1)`,
                                                [email, name, phone, password, datetimenow, datetimenow],
                                                function (error, rows, fields) {
                                                    if (error) {
                                                        console.log(error);
                                                    } else {

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
                                                                    <h1>Informasi Pembuatan Akun Konservasi Satwa dari Instansi Lestari</h1>
                                                                    <p>Salam sejahtera,</p>
                                                                    <p>Kami dari Instansi Lestari ingin memberitahu Anda bahwa data konservasi satwa yang Anda minta telah berhasil kami kirimkan. Berikut adalah detail pengiriman:</p>
                                                                    <ul>
                                                                        <li><strong>Tanggal Pengiriman:</strong> ${formattedDateTime}</li>
                                                                        <li><strong>Jenis Data:</strong> Akun User</li>
                                                                        <li><strong>Metode Pengiriman:</strong> Email</li>                                                                                            
                                                                        <li><strong>Email:</strong> ${email}</li>
                                                                        <li><strong>Password:</strong> ${phone}</li>
                                                                    </ul>
                                                                    <p><strong>Perhatian:</strong> Password harap segera diganti untuk keamanan akun Anda.</p>
                                                                    <p>Terima kasih telah menggunakan layanan kami. Jika Anda memiliki pertanyaan lebih lanjut, jangan ragu untuk menghubungi kami di nomor yang tercantum di bawah
                                                                    <p>Salam hormat,</p>
                                                                    <p>Tim Lestari</p>
                                                                    <p>Contact: ${process.env.EMAIL} | Phone: <a href="${process.env.PHONE_WA}">${process.env.PHONE_FORMATTED}</a>  </p>
                                                            w
                                                                                
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
                                                });
                                        } else {
                                            console.log("No data found for the specified ID.");
                                        }
                                    }
                                });
                            }
                        });

                }
            }
        }
    )


};
