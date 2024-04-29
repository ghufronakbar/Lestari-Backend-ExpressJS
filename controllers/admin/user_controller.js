'use strict';

var response = require('../../res');
var connection = require('../../connection');
var md5 = require('md5');

exports.index = function (req, res) {
    response.ok("REST API Worked!", res)
}

//GET USERS
exports.webusers = function (req, res) {
    connection.query(`SELECT * FROM users`,
        function (error, rows, fields) {
            if (error) {
                console.log(error);
            } else {
                response.ok(rows, res)
            };
        }
    )
};

//GET ID USER
exports.webuserid = function (req, res) {
    let id = req.params.id
    connection.query(`SELECT * FROM users`, [id],
        function (error, rows, fields) {
            if (error) {
                console.log(error);
            } else {
                response.ok(rows, res)
            };
        }
    )
};


//SUSPEND USER
exports.webusersuspend = function (req, res) {
    let status = req.body.status
    let id = req.body.id
    if (status == 1) {
        connection.query(`UPDATE users SET status=1 WHERE id_user=?`,[id],
            function (error, rows, fields) {
                if (error) {
                    console.log(error);
                } else {
                    response.ok(rows, res)
                };
            }
        )
    } else if (status == 0) {
        connection.query(`UPDATE users SET status=0 WHERE id_user=?`, [id],
            function (error, rows, fields) {
                if (error) {
                    console.log(error);
                } else {
                    response.ok(rows, res)
                };
            }
        )
    }

};