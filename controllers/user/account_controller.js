"use strict";
const path = require("path");
const url = require("url");
const fs = require("fs");
const multer = require("multer");
var response = require("../../res");
var connection = require("../../connection");
const verifikasi = require("../../middleware/verifikasi");
var md5 = require("md5");
const nodemailer = require("nodemailer");
require('dotenv').config()

exports.index = function (req, res) {
  response.ok("REST API Worked!", res);
};

//GET EDITABLE ANIMALS
exports.mobaccount = function (req, res) {
  let token = req.params.token;
  verifikasi(token)(req, res, function () {
    var id_user = req.decoded.id_user;
    var data = ["id_user", "email", "name", "phone", "picture"];
    connection.query(
      `SELECT ?? FROM users 
                        WHERE id_user=?`,
      [data, id_user],
      function (error, rows, fields) {
        if (error) {
          console.log(error);
          res.status(500).send("Internal Server Error");
        } else {
          response.ok(rows, res);
        }
      }
    );
  });
};
//Post password Users match
exports.mobaccountpassword = function (req, res) {
  let token = req.body.token;
  let password = req.body.password;
  verifikasi(token)(req, res, function () {
    var id_user = req.decoded.id_user;
    connection.query(
      `SELECT password FROM users 
                        WHERE id_user=?`,
      [id_user],
      function (error, rows, fields) {
        if (error) {
          console.log(error);
          res.status(500).send("Internal Server Error");
        } else {
          var oldPassword = md5(password);
          if (oldPassword == rows[0].password) {
            res.status(200).json({ match: true });
          } else {
            res.status(200).json({ match: false });
          }
        }
      }
    );
  });
};

//PUT PASSWORD
exports.mobpasswordedit = function (req, res) {
  let new_password = req.body.new_password;
  let token = req.body.token;
  verifikasi(token)(req, res, function () {
    var id_user = req.decoded.id_user;
    connection.query(
      `UPDATE users SET password=? WHERE id_user=?`,
      [md5(new_password), id_user],
      function (error, rows, fields) {
        if (error) {
          console.log(error);
          res.status(500).send("Internal Server Error");
        } else {
          response.ok(rows, res);
        }
      }
    );
  });
};

exports.mobregisteruser = function (req, res) {
  let userName = req.body.name;
  let email = req.body.email;
  let phone = req.body.phone;
  let profession = req.body.profession;
  let instances = req.body.instances;
  let subject = req.body.kepentingan;
  let body = req.body.deskripsi;
  let now = new Date();
  let date_now =
    now.getFullYear() +
    "-" +
    ("0" + (now.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + now.getDate()).slice(-2) +
    " " +
    ("0" + now.getHours()).slice(-2) +
    ":" +
    ("0" + now.getMinutes()).slice(-2) +
    ":" +
    ("0" + now.getSeconds()).slice(-2);
  connection.query(
    `INSERT INTO request_accounts 
                    (name, email, phone, profession, instances, subject, body, date, approve) 
                    VALUES (?,?,?,?,?,?,?,?,?)`,
    [
      userName,
      email,
      phone,
      profession,
      instances,
      subject,
      body,
      date_now,
      1, // Default value for approve set to 1
    ],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json({ keterangan: "berhasil menambah data" });
      }
    }
  );
};

//EDIT ACCOUNT NAME
exports.mobaccounteditname = function (req, res) {
  let name = req.body.name;
  let token = req.params.token;
  let now = new Date();
  let date_now =
    now.getFullYear() +
    "-" +
    ("0" + (now.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + now.getDate()).slice(-2) +
    " " +
    ("0" + now.getHours()).slice(-2) +
    ":" +
    ("0" + now.getMinutes()).slice(-2) +
    ":" +
    ("0" + now.getSeconds()).slice(-2);

  verifikasi(token)(req, res, function () {
    var id_user = req.decoded.id_user;
    connection.query(
      `UPDATE users SET name=?, updated_at=? WHERE id_user=?`,
      [name, date_now, id_user],
      function (error, rows, fields) {
        if (error) {
          console.log(error);
        } else {
          response.ok(rows, res);
        }
      }
    );
  });
};

//EDIT ACCOUNT PICTURE
exports.mobaccounteditpicture = function (req, res) {
  let picture = req.body.picture;
  let token = req.params.token;
  let now = new Date();
  let date_now =
    now.getFullYear() +
    "-" +
    ("0" + (now.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + now.getDate()).slice(-2) +
    " " +
    ("0" + now.getHours()).slice(-2) +
    ":" +
    ("0" + now.getMinutes()).slice(-2) +
    ":" +
    ("0" + now.getSeconds()).slice(-2);

  connection.query(
    `UPDATE users SET picture=?, updated_at=? WHERE id_user=?`,
    [picture, date_now, token],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        response.ok(rows, res);
      }
    }
  );
};

//UPLOAD ANIMAL IMAGE BY USER
exports.mob_update_profile = function (req, res) {
  let token = req.params.token;
  console.log(token);
  verifikasi(token)(req, res, function () {
    var id_user = req.decoded.id_user;
    connection.query(
      `SELECT picture FROM users 
                        WHERE id_user=?`,
      [id_user],
      function (error, rows, fields) {
        if (error) {
          console.log(error);
          res.status(500).send("Internal Server Error");
        } else {
          console.log("cek ", rows[0].picture);
          const uploadDirectory = path.join(
            __dirname,
            "..",
            "..",
            "upload",
            "images"
          );

          // Menggunakan modul url untuk mengurai URL
          const parsedUrl = url.parse(rows[0].picture);

          // Menggunakan modul path untuk mendapatkan nama file dari path
          const fileName = path.basename(parsedUrl.pathname);
          console.log(fileName);
          // storage engine
          const storage = multer.diskStorage({
            destination: "./upload/profile",
            filename: (req, file, cb) => {
              return cb(null, fileName);
            },
          });

          const upload = multer({
            storage: storage,
            limits: {
              fileSize: 10 * 1024 * 1024, // 10 MB (dalam bytes)
            },
          }).single("image");
          upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
              // Jika terjadi kesalahan dari multer (misalnya melebihi batas ukuran file)
              return res.json({
                success: 0,
                message: err.message,
              });
            } else if (err) {
              // Jika terjadi kesalahan lainnya
              return res.json({
                success: 0,
                message: "Terjadi kesalahan saat mengunggah gambar",
              });
            }
            res.json({
              success: 200,
              image_url: `/v1/mob/image/profile/${req.file.filename}`,
            });
          });
          //   response.ok(rows, res);
        }
      }
    );
  });
};

//EDIT ACCOUNT PASSWORD
exports.mobaccounteditpassword = function (req, res) {
  let old_password = md5(req.body.old_password);
  let new_password = md5(req.body.new_password);
  let token = req.params.token;
  let now = new Date();
  let date_now =
    now.getFullYear() +
    "-" +
    ("0" + (now.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + now.getDate()).slice(-2) +
    " " +
    ("0" + now.getHours()).slice(-2) +
    ":" +
    ("0" + now.getMinutes()).slice(-2) +
    ":" +
    ("0" + now.getSeconds()).slice(-2);

  connection.query(
    `SELECT password FROM users WHERE id_user=?`,
    [token],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        if (rows.length > 0) {
          let verification_password = rows[0].password;
          if (old_password == verification_password) {
            connection.query(
              `UPDATE users SET password=?, updated_at=? WHERE id_user=?`,
              [new_password, date_now, token],
              function (error, rows, fields) {
                if (error) {
                  console.log(error);
                } else {
                  response.ok(rows, res);
                }
              }
            );
          } else {
            response.error("Password Salah", res);
          }
        }
      }
    }
  );
};



exports.mobforgotpassword = function (req, res) {
  let email = req.body.email;
  let otp = req.body.otp;

  if (!otp && email) {
    connection.query(`SELECT * FROM users WHERE email=?`, [email],
      function (error, results, fields) {
        if (error) {
          console.log(error)
        } else {
          if (results.length == 0) {
            res.status(400).send(`${email} Is Not User!`)
          } else {
            let otpcode = '';
            for (let i = 0; i < 6; i++) {
              otpcode += Math.floor(Math.random() * 10);
            }
            let currentTime = new Date();
            let expired_at = new Date(currentTime.getTime() + 5 * 60000);
            connection.query(`INSERT INTO otps(email,otp,expired_at) VALUES(?,?,?)`, [email, otpcode, expired_at],
              function (error, rows, fields) {
                if (error) {
                  console.log(error)
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
                    subject: "Kode OTP Lestari", // Subject line                                                                    
                    html: `
                    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kode OTP Lestari</title>
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
        .otp-code {
            font-size: 24px; /* Ukuran font yang besar */
            font-weight: bold; /* Tebal */
            display: block; /* Membuat teks berada di tengah */
            text-align: center; /* Pusatkan teks */
            margin-bottom: 20px; /* Berikan jarak bawah */
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
        <h1>Verifikasi Akun</h1>
        <p>Salam sejahtera,</p>
        <p>Sebelum melakukan reset password pada akun Anda terlebih dahulu dengan memasukkan kode OTP berikut ini untuk menyelesaikan proses verifikasi pada akun Lestari kamu.</p>                            
        <span class="otp-code">${otpcode}</span> 
        <p><strong>Perhatian:</strong> Kode OTP hanya berlaku 5 menit dan bersifat rahasia. Mohon untuk tidak membagikan kode ini kepada siapapun termasuk pihak yang mengatasnamakan pihak Lestari.</p>
        <p>Terima kasih telah menggunakan layanan kami. Jika Anda memiliki pertanyaan lebih lanjut, jangan ragu untuk menghubungi kami di nomor yang tercantum di bawah</p>
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
              })
          }

        }
      }
    )


  } else if (email && otp) {
    connection.query(`SELECT * FROM users WHERE email=?`, [email],
      function (error, results, fields) {
        if (error) {
          console.log(error)
        } else {
          if (results.length == 0) {
            res.status(400).send(`${email} Is Not User!`)
          } else {
            connection.query(`SELECT * FROM otps WHERE email=? AND id_otp = (SELECT MAX(id_otp) FROM otps WHERE email=?)`,
              [email, email],
              function (error, results, fields) {
                if (error) {
                  console.log(error)
                } else {

                  let confirmation_used = results[0].used
                  let confirmation_otp = results[0].otp
                  let expired_at = results[0].expired_at
                  let email = results[0].email
                  let currentTime = new Date();

                  if (confirmation_used == 1) {
                    res.status(400).send("OTP Has Been Used!");
                  } else if (confirmation_otp != otp) {
                    res.status(400).send("OTP Incorrect!");
                  } else if (currentTime > expired_at) {
                    res.status(400).send("OTP Has Been Expired!");
                  } else if (currentTime < expired_at) {
                    connection.query(`UPDATE otps SET used=1 WHERE email=? AND id_otp = (SELECT MAX(id_otp) FROM otps WHERE email=?)`,
                      [email, email],
                      function (error, rows, fields) {
                        if (error) {
                          console.log(error)
                        } else {
                          let new_password = '';
                          for (let i = 0; i < 6; i++) {
                            new_password += Math.floor(Math.random() * 10);
                          }
                          connection.query(`UPDATE users SET password=? WHERE email=?`, [md5(new_password), email],
                            function (error, rows, fields) {
                              if (error) {
                                console.log(error)
                              } else {

                                let now = new Date();
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
                                  from: '"Lestari" <main@lestari.com>', 
                                  to: `${email}`, 
                                  subject: "Reset Password", 
                                  html: `
                                  <!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Reset Password</title>
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
                      .otp-code {
                          font-size: 24px; /* Ukuran font yang besar */
                          font-weight: bold; /* Tebal */
                          display: block; /* Membuat teks berada di tengah */
                          text-align: center; /* Pusatkan teks */
                          margin-bottom: 20px; /* Berikan jarak bawah */
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
                      <h1>Reset Password</h1>
                      <p>Salam sejahtera,</p>
                      <p>Kami dari Instansi Lestari ingin memberitahu Anda bahwa reset password pada akun anda telah berhasil. Berikut adalah akun anda yang baru:</p>
                      <ul>
                                                                        <li><strong>Tanggal Reset Password:</strong> ${formattedDateTime}</li>                                                                                                                                                                                                                                         
                                                                        <li><strong>Email:</strong> ${email}</li>
                                                                        <li><strong>Password:</strong> ${new_password}</li>
                                                                    </ul>
                      <p><strong>Perhatian:</strong> Password harap segera diganti untuk keamanan akun Anda.</p>
                      <p>Terima kasih telah menggunakan layanan kami. Jika Anda memiliki pertanyaan lebih lanjut, jangan ragu untuk menghubungi kami di nomor yang tercantum di bawah</p>
                      <p>Salam hormat,</p>
                      <p>Tim Lestari</p>
                      <p>Contact: ${process.env.EMAIL} | Phone: <a href="${process.env.PHONE_WA}">${process.env.PHONE_FORMATTED}</a>  </p>
                  </div>
              </body>
              </html>
                                  `
                                }

                                async function main() {
                                  
                                  const info = await transporter.sendMail(msg);
              
                                  
                                }
                                main().catch(console.error);
              
                                response.ok(rows, res)
                              }
                            })
                        }
                      })
                  }
                }
              })
          }
        }
      })

  } else { res.status(400).send("Insert Email!"); }
};