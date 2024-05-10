'use strict';

var response = require('../../res');
var connection = require('../../connection');
var md5 = require('md5');
var ip = require('ip');
var config = require('../../config/secret')
var jwt = require('jsonwebtoken');
var mysql = require('mysql');

//LOGIN
exports.login = function (req, res) {  
    var post = {
      email: req.body.email,
      password: req.body.password,
    };
    var query = "SELECT * FROM ?? WHERE ??=? AND ??=?";
    var table = ["admins", "password", md5(post.password), "email", post.email];
  
    query = mysql.format(query, table);
    connection.query(query, function (error, rows) {
      if (error) {
        console.log(error);
      } else {
        if (rows.length == 1) {
          var id_admin = rows[0].id_admin;
          var token = jwt.sign({ id_admin }, config.secret, {
            expiresIn: 43200,
          });
  
          // Hapus token lama sebelum memperbarui dengan yang baru
          var deleteQuery = "UPDATE ?? SET ?? = NULL WHERE id_admin = ?";
          var deleteTable = ["admins", "refresh_token", id_admin];
  
          deleteQuery = mysql.format(deleteQuery, deleteTable);
          connection.query(deleteQuery, function (deleteError, deleteRows) {
            if (deleteError) {
              console.log(deleteError);
            } else {
              // Setelah menghapus token lama, lakukan pembaruan dengan yang baru
              var updateQuery =
                "UPDATE ?? SET ?? = ? , ?? = ?  WHERE id_admin = ?";
              var updateTable = [
                "admins",
                "refresh_token",
                token,
                "ip_address",
                ip.address(),
                id_admin,
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
          res.status(400).json({
            Error: true,
            Message: "Email atau Password Salah!",
          });
        }
      }
    });
  };
  
