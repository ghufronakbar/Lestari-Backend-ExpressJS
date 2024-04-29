"use strict";

var response = require("../../res");
var connection = require("../../connection");
var md5 = require("md5");
const verifikasi = require("../../middleware/verifikasi");
const url = require("url");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { stringify } = require("querystring");

exports.index = function (req, res) {
  response.ok("REST API Worked!", res);
};

//GET EDITABLE ANIMALS -DONE
exports.mobeditableanimals = function (req, res) {
  let today = new Date();
  let sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  let formattedDate = sevenDaysAgo.toISOString().slice(0, 10);
  let token = req.params.token;

  // Gunakan middleware verifikasi di sini
  verifikasi(token)(req, res, function () {
    var id_user = req.decoded.id_user; // Dapatkan id_user dari decoded token
    var data = [
      "id_animal",
      "local_name",
      "latin_name",
      "image",
      "city",
      "longitude",
      "latitude",
    ];
    connection.query(
      `SELECT ?? FROM animals 
              WHERE date >= ? AND id_user=?
              ORDER BY updated_at DESC`,
      [data, formattedDate, id_user],
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

//GET ID EDITABLE ANIMAL -DONE
exports.mobeditableanimalid = function (req, res) {
  let today = new Date();
  let sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  let formattedDate = sevenDaysAgo.toISOString().slice(0, 10);
  let token = req.params.token;
  let id_animal = req.params.id_animal;
  console.log(id_animal);

  verifikasi(token)(req, res, function () {
    var id_user = req.decoded.id_user;
    connection.query(
      `SELECT * FROM animals 
                        WHERE date >= ? AND id_user=? AND id_animal=?`,
      [formattedDate, id_user, id_animal],
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

//POST ANIMAL BY USER-DONE
exports.mobanimalpost = function (req, res) {
  let local_name = req.body.local_name;
  let latin_name = req.body.latin_name;
  let habitat = req.body.habitat;
  let description = req.body.description;
  let city = req.body.city;
  let longitude = req.body.longitude;
  let latitude = req.body.latitude;
  let image = req.body.image;
  let amount = req.body.amount;
  let token = req.body.token;
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
      `INSERT INTO animals 
                            (local_name, latin_name, habitat, description, city, longitude, latitude, image, amount, id_user, date,updated_at) 
                            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        local_name,
        latin_name,
        habitat,
        description,
        city,
        longitude,
        latitude,
        image,
        amount,
        id_user,
        date_now,
        date_now,
      ],
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

// DELETE ANIMAL BY USER -DONE
exports.deleteAnimalById = function (req, res) {
  let id_animal = req.params.id_animal;
  let token = req.params.token;

  verifikasi(token)(req, res, function () {
    var id_user = req.decoded.id_user;
    connection.query(
      "SELECT image FROM `animals` WHERE id_animal = ?",
      [id_animal],
      function (error, rows, fields) {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "Internal server error" });
        } else {
          console.log(rows[0].image);
          var url = rows[0].image;
          var filename = url.substring(url.lastIndexOf("/") + 1);

          const imagePath = path.join("upload/images", filename);

          console.log("CEKLAH", imagePath);

          // Periksa apakah file ada
          if (fs.existsSync(imagePath)) {
            // Hapus file
            fs.unlinkSync(imagePath);
            connection.query(
              "DELETE FROM `animals` WHERE `animals`.`id_animal`=?",
              [id_animal],
              function (error, rows, fields) {
                if (error) {
                  console.log(error);
                  res.status(500).json({ error: "Internal server error" });
                } else {
                  if (rows.affectedRows > 0) {
                    response.ok(rows, res);
                  } else {
                    res.status(404).json({ error: "Animal not found" });
                  }
                }
              }
            );
          } else {
            res.status(404).json({
              success: 0,
              message: "Gambar tidak ditemukan",
            });
          }
        }
      }
    );
  });
};

//EDIT ANIMAL BY USER -DONE
exports.mobediteditableanimal = function (req, res) {
  let local_name = req.body.local_name;
  let latin_name = req.body.latin_name;
  let habitat = req.body.habitat;
  let description = req.body.description;
  let city = req.body.city;
  let longitude = req.body.longitude;
  let latitude = req.body.latitude;
  let amount = req.body.amount;
  let image = req.body.image;
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
  let id_animal = req.params.id_animal;

  verifikasi(token)(req, res, function () {
    var id_user = req.decoded.id_user;
    connection.query(
      `UPDATE animals SET local_name=?,latin_name=?, habitat=?, description=?,
                          city=?, longitude=?, latitude=?,
                          image=?, amount=?, updated_at=? WHERE id_animal=? AND id_user=?`,
      [
        local_name,
        latin_name,
        habitat,
        description,
        city,
        longitude,
        latitude,
        image,
        amount,
        date_now,
        id_animal,
        id_user,
      ],
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

//UPLOAD ANIMAL IMAGE BY USER
exports.mob_upload_image = function (req, res) {
  let token = req.params.token;
  console.log(token);
  verifikasi(token)(req, res, function () {
    var id_user = req.decoded.id_user;

    // storage engine
    const storage = multer.diskStorage({
      destination: "./upload/images",
      filename: (req, file, cb) => {
        return cb(
          null,
          `${file.fieldname}_${id_user + Date.now()}${path.extname(
            file.originalname
          )}`
        );
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

      // Jika berhasil, Anda dapat mengakses informasi file yang diunggah
      // melalui req.file
      // var nama = req.file.filename;
      res.json({
        success: 200,
        image_url: `http://192.168.0.118:5000/v1/mob/image/${req.file.filename}`,
      });
    });
  });
};

// DELETE ANIMAL BY USER -DONE
exports.deleteImageByURL = function (req, res) {
  let imageUrl = req.body.imageUrl;
  let token = req.body.token;

  verifikasi(token)(req, res, function () {
    // Tentukan path direktori tempat file-file diunggah
    const uploadDirectory = path.join(
      __dirname,
      "..",
      "..",
      "upload",
      "images"
    );

    // Menggunakan modul url untuk mengurai URL
    const parsedUrl = url.parse(imageUrl);

    // Menggunakan modul path untuk mendapatkan nama file dari path
    const fileName = path.basename(parsedUrl.pathname);
    console.log(uploadDirectory);
    const filePath = path.join(uploadDirectory, fileName);

    // Cek apakah file ada
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error("File not found:", err);
        return res.status(404).send("File not found");
      }

      // Hapus file
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          return res.status(500).send("Error deleting file");
        }
        console.log("File deleted successfully");
        res.send("File deleted successfully");
      });
    });
  });
};

// // DELETE ANIMAL BY USER -DONE
// exports.mob_upload_image = function (req, res) {
//   const path = require("path");
//   let token = req.body.token;
//   // Set the path to store your converted image
//   var matches = req.body.image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
//     response = {};

//   verifikasi(token)(req, res, function () {
//     var id_user = req.decoded.id_user;

//     if (matches.length !== 3) {
//       return res.status(400).json({ error: "Invalid input string" });
//     }

//     response.type = matches[1];
//     response.data = Buffer.from(matches[2], "base64"); // Using Buffer.from() to create buffer from base64 string
//     let decodedImg = response;
//     let imageBuffer = decodedImg.data;
//     let type = decodedImg.type;
//     let extension = "." + type.split("/")[1]; // Get extension from content type
//     let fileName =
//       `image_${Date.now()}${path.extname(`${id_user}`)}` + extension;
//     try {
//       fs.writeFileSync("./upload/images/" + fileName, imageBuffer, "utf8"); // Save image to specified directory
//       return res.status(200).json({
//         status: "success",
//         urlImage: `http://192.168.0.118:5000/v1/mob/image/${fileName}`,
//       });
//     } catch (e) {
//       return res.status(500).json({ error: "Internal server error" });
//     }
//   });
// };
