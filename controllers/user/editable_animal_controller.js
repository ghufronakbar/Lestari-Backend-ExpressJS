"use strict";

var response = require("../../res");
var connection = require("../../connection");
var md5 = require("md5");
const verifikasi = require("../../middleware/verifikasi");

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
      "city",
      "longitude",
      "latitude",
    ];
    connection.query(
      `SELECT ? FROM animals 
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

//POST ANIMAL BY USER
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
      token,
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
};

//EDIT ANIMAL BY USER
exports.mobediteditableanimal = function (req, res) {
  let local_name = req.body.local_name;
  let latin_name = req.body.latin_name;
  let habitat = req.body.habitat;
  let description = req.body.description;
  let city = req.body.city;
  let longitude = req.body.longitude;
  let latitude = req.body.latitude;
  let amount = req.body.amount;
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

  connection.query(
    `UPDATE animals SET local_name=?,latin_name=?, habitat=?, description=?,
                        city=?, longitude=?, latitude=?,
                        amount=?, 
                        updated_at=? WHERE id_animal=? AND id_user=?`,
    [
      local_name,
      latin_name,
      habitat,
      description,
      city,
      longitude,
      latitude,
      amount,
      date_now,
      id_animal,
      token,
    ],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        response.ok(rows, res);
      }
    }
  );
};

//EDIT ANIMAL IMAGE BY USER
exports.mobediteditableanimalimage = function (req, res) {
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

  connection.query(
    `UPDATE animals SET image=?, updated_at=? WHERE id_animal=? AND id_user=?`,
    [image, date_now, id_animal, token],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
      } else {
        response.ok(rows, res);
      }
    }
  );
};
