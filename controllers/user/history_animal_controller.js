"use strict";

var response = require("../../res");
var connection = require("../../connection");
const verifikasi = require("../../middleware/verifikasi");
var md5 = require("md5");

exports.index = function (req, res) {
  response.ok("REST API Worked!", res);
};

//GET HISTORY ANIMALS
exports.mobhistoryanimals = function (req, res) {
  let token = req.params.token;
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
                  WHERE id_user=?
                  ORDER BY updated_at DESC`,
      [data, id_user],
      function (error, rows, fields) {
        if (error) {
          console.log(error);
          res.status(500).send("Internal Server Error");
        } else {
          let results = [];
          rows.forEach(row => {
            results.push({
              id_animal: row.id_animal,
              local_name: row.local_name,
              latin_name: row.latin_name,
              image: row.image ? process.env.BASE_URL + `/v1/mob/image/animal/` + row.image : process.env.BASE_URL + `/v1/mob/image/default/picture.webp`,
              city: row.city,
              longitude: row.longitude,
              latitude: row.latitude,
            });
          });
          return res.status(200).json({ status: 200, values: results });
        }
      }
    );
  });
};

//GET HISTORY ID ANIMAL
exports.mobhistoryanimalid = function (req, res) {
  let token = req.params.token;
  let id_animal = req.params.id_animal;
  connection.query(
    `SELECT * FROM animals WHERE
                      id_animal=?`,
    [id_animal],
    function (error, rows, fields) {
      if (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
      } else {
        let results = [];
        rows.forEach(row => {
          results.push({
            id_animal: row.id_animal,
            local_name: row.local_name,
            latin_name: row.latin_name,
            habitat: row.habitat,
            description: row.description,
            city: row.city,
            longitude: row.longitude,
            latitude: row.latitude,
            image: row.image ? process.env.BASE_URL + `/v1/mob/image/animal/` + row.image : process.env.BASE_URL + `/v1/mob/image/default/picture.webp`,
            amount: row.amount,
            id_user: row.id_user,
            data: row.date,
            updated_at: row.updated_at
          });
        });
        return res.status(200).json({ status: 200, values: results });
      }
    }
  );
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
