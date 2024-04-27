"use strict";

var connection = require("../../connection");
var mysql = require("mysql");
var md5 = require("md5");
var response = require("../../res");
var jwt = require("jsonwebtoken");
var config = require("../../config/secret");
var ip = require("ip");

//REGISTER
// exports.register = function(req,res){
//     var post = {
//         nik: req.body.nik,
//         kk: req.body.kk,
//         nama_lengkap: req.body.nama_lengkap,
//         tanggal_lahir: req.body.tanggal_lahir,
//         foto: "default.png",
//         hak_pilih: 0,
//         password: md5(req.body.password)
//     }

//     var query = "SELECT nik FROM ?? WHERE ??";
//     var table = ["warga","nik",post.nik]

//     query = mysql.format(query,table);

//     connection.query(query, function(error, rows) {
//         if (error) {
//             console.log(error);
//             response.error("Terjadi kesalahan pada server", res);
//         } else {
//             let isNIKExist = false;
//             rows.forEach(row => {
//                 if (row.nik === post.nik) {
//                     isNIKExist = true;
//                 }
//             });

//             if (!isNIKExist) {
//                 var query = "INSERT INTO ?? SET ?";
//                 var table = ["warga"];
//                 query = mysql.format(query,table);
//                 connection.query(query,post, function(error,rows) {
//                     if(error){
//                         console.log(error)
//                         response.error("Gagal menambahkan data warga", res);
//                     } else {
//                         response.ok("Berhasil menambahkan data warga", res);
//                     }
//                 });
//             } else {
//                 console.log("NIK Sudah Terdaftar!");
//                 response.error("NIK sudah terdaftar!", res);
//             }
//         }
//     });
// }

//LOGIN
exports.login = function (req, res) {
  var post = {
    email: req.body.email,
    password: req.body.password,
  };
  var query = "SELECT * FROM ?? WHERE ??=? AND ??=?";
  var table = ["users", "password", md5(post.password), "email", post.email];

  query = mysql.format(query, table);
  connection.query(query, function (error, rows) {
    if (error) {
      console.log(error);
    } else {
      if (rows.length == 1) {
        var id_user = rows[0].id_user;
        var token = jwt.sign({ id_user }, config.secret, {
          expiresIn: 1440,
        });

        // Hapus token lama sebelum memperbarui dengan yang baru
        var deleteQuery = "UPDATE ?? SET ?? = NULL WHERE id_user = ?";
        var deleteTable = ["users", "refresh_token", id_user];

        deleteQuery = mysql.format(deleteQuery, deleteTable);
        connection.query(deleteQuery, function (deleteError, deleteRows) {
          if (deleteError) {
            console.log(deleteError);
          } else {
            // Setelah menghapus token lama, lakukan pembaruan dengan yang baru
            var updateQuery =
              "UPDATE ?? SET ?? = ? , ?? = ?  WHERE id_user = ?";
            var updateTable = [
              "users",
              "refresh_token",
              token,
              "ip_address",
              ip.address(),
              id_user,
            ];

            updateQuery = mysql.format(updateQuery, updateTable);
            connection.query(updateQuery, function (updateError, updateRows) {
              if (updateError) {
                console.log(updateError);
              } else {
                res.json({
                  success: true,
                  message: "Token JWT Generated!",
                  token: token,
                });
              }
            });
          }
        });
      } else {
        console.log(query);
        res.json({
          Error: true,
          Message: "Email atau Password Salah!",
        });
      }
    }
  });
};
