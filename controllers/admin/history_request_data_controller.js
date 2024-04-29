'use strict';

var response = require('../../res');
var connection = require('../../connection');
var md5 = require('md5');

exports.index = function (req, res) {
    response.ok("REST API Worked!", res)
}

//GET HISTORY REQUEST DATA
exports.webhistoryrequestdatas = function (req, res) {
    connection.query(`SELECT 

    history_request_datas.id_history_request_data	,
    history_request_datas.email	,
    history_request_datas.name	,
    history_request_datas.profession,	
    history_request_datas.instances	,
    history_request_datas.subject,	
    history_request_datas.body	,
    history_request_datas.id_send_data	,
    history_request_datas.id_user	,
    history_request_datas.date,
send_datas.id_send_data	,
send_datas.local_name	,
send_datas.latin_name	,
send_datas.habitat	,
send_datas.description,	
send_datas.city	,
send_datas.longitude	,
send_datas.latitude	,
send_datas.image	,
send_datas.amount	,
send_datas.date_start,	
send_datas.date_end
    FROM history_request_datas JOIN send_datas
    WHERE history_request_datas.id_send_data = send_datas.id_send_data
    `,
        function (error, rows, fields) {
            if (error) {
                connection.log(error);
            } else {
                response.ok(rows, res)
            };
        }
    )
};


//GET ID HISTORY REQUEST DATA
exports.webhistoryrequestdataid = function (req, res) {
    let id = req.params.id
    connection.query(`SELECT 

    history_request_datas.id_history_request_data	,
    history_request_datas.email	,
    history_request_datas.name	,
    history_request_datas.profession,	
    history_request_datas.instances	,
    history_request_datas.subject,	
    history_request_datas.body	,
    history_request_datas.id_send_data	,
    history_request_datas.id_user	,
    history_request_datas.date,
send_datas.id_send_data	,
send_datas.local_name	,
send_datas.latin_name	,
send_datas.habitat	,
send_datas.description,	
send_datas.city	,
send_datas.longitude	,
send_datas.latitude	,
send_datas.image	,
send_datas.amount	,
send_datas.date_start,	
send_datas.date_end
    FROM history_request_datas JOIN send_datas
    WHERE history_request_datas.id_send_data = send_datas.id_send_data
    AND history_request_datas.id_history_request_data=?
    `,[id],
        function (error, rows, fields) {
            if (error) {
                connection.log(error);
            } else {
                response.ok(rows, res)
            };
        }
    )
};
