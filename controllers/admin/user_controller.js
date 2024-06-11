'use strict';

var response = require('../../res');
var connection = require('../../connection');
var md5 = require('md5');

exports.index = function (req, res) {
    response.ok("REST API Worked!", res)
}

//GET USERS
exports.webusers = function (req, res) {
    connection.query(`SELECT id_user, email, name, phone, picture, created_at, updated_at, status FROM users`,
        function (error, rows, fields) {
            if (error) {
                console.log(error);
            } else {
                let results = [];
                rows.forEach(row => {
                    results.push({
                        id_user: row.id_user,
                        name: row.name,
                        email: row.email,
                        picture: row.picture ? process.env.BASE_URL + `/v1/mob/image/profile/` + row.picture : process.env.BASE_URL + `/v1/mob/image/default/picture.webp`,
                        phone: row.phone,
                        created_at: row.created_at,
                        updated_at: row.updated_at,
                        status: row.status
                    });
                });
                return res.status(200).json({ status: 200, values: results });
            };
        }
    )
};

//GET ID USER
exports.webuserid = function (req, res) {
    let id = req.params.id
    connection.query(`SELECT id_user, email, name, phone, picture, created_at, updated_at, status FROM users WHERE id_user=?`, [id],
        function (error, rows, fields) {
            if (error) {
                console.log(error);
            } else {
                let results = [];
                rows.forEach(row => {
                    results.push({
                        id_user: row.id_user,
                        name: row.name,
                        email: row.email,
                        picture: row.picture ? process.env.BASE_URL + `/v1/mob/image/profile/` + row.picture : process.env.BASE_URL + `/v1/mob/image/default/picture.webp`,
                        phone: row.phone,
                        created_at: row.created_at,
                        updated_at: row.updated_at,
                        status: row.status
                    });
                });
                return res.status(200).json({ status: 200, values: results });
            };
        }
    )
};


//SUSPEND USER
exports.webusersuspend = function (req, res) {
    let status = req.body.status
    let id = req.body.id
    if (status == 1) {
        connection.query(`UPDATE users SET status=1 WHERE id_user=?`, [id],
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