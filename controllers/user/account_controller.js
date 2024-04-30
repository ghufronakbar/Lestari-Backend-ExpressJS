"use strict";
const path = require("path");
const url = require("url");
const fs = require("fs");
const multer = require("multer");
var response = require("../../res");
var connection = require("../../connection");
const verifikasi = require("../../middleware/verifikasi");
var md5 = require("md5");

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
              image_url: `http://192.168.1.22:5000/v1/mob/image/profile/${req.file.filename}`,
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
