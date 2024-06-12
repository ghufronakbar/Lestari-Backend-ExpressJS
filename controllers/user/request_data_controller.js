var response = require("../../res");
var connection = require("../../connection");
const verifikasi = require("../../middleware/verifikasi");

exports.mobhistoryrequestdata = function (req, res) {
  let token = req.params.token;
  verifikasi(token)(req, res, function () {
    var id_user = req.decoded.id_user; // Dapatkan id_user dari decoded token
    var data = [
      "id_request_data",
      "name",
      "email",
      "profession",
      "instances",
      "subject",
      "body",
      "date",
      "approve",
      "url",
    ];
    connection.query(
      `SELECT ?? FROM request_datas 
                    WHERE id_user=?
                    ORDER BY date DESC`,
      [data, id_user],
      function (error, rows, fields) {
        if (error) {
          console.log(error);
          res.status(500).send("Internal Server Error");
        } else {
          let result = []
          rows.forEach(row => {
            result.push({
              id_request_data: row.id_request_data,
              name: row.name,
              email: row.email,
              profession: row.profession,
              instances: row.instances,
              subject: row.subject,
              body: row.body,
              date: row.date,
              approve: row.approve,
              url: process.env.BASE_URL + `/v1/mob/data/` + row.url,
            })
          });
          return res.status(200).json({ status: 200, values: result })
        }
      }
    );
  });
};

exports.mobhistoryrequestdatabyid = function (req, res) {
  let token = req.params.token;
  let id_request_data = req.params.id_request_data;
  verifikasi(token)(req, res, function () {
    var id_user = req.decoded.id_user;
    connection.query(
      `SELECT * FROM request_datas 
                    WHERE id_request_data=?
                    ORDER BY date DESC`,
      [id_request_data],
      function (error, rows, fields) {
        if (error) {
          console.log(error);
          res.status(500).send("Internal Server Error");
        } else {
          let result = []
          rows.forEach(row => {
            result.push({
              id_request_data: row.id_request_data,
              name: row.name,
              email: row.email,
              profession: row.profession,
              instances: row.instances,
              subject: row.subject,
              body: row.body,
              date: row.date,
              approve: row.approve,
              url: process.env.BASE_URL + `/v1/mob/data/` + row.url,
            })
          });
          return res.status(200).json({ status: 200, values: result })
        }
      }
    );
  });
};

exports.mobaddrequestdata = function (req, res) {
  let profession = req.body.profession;
  let instances = req.body.instances;
  let subject = req.body.subject;
  let body = req.body.body;
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
    var data = ["email", "name"];
    connection.query(
      `SELECT ?? FROM users WHERE id_user=?`,
      [data, id_user],
      function (error, rows, fields) {
        if (error) {
          console.log(error);
          res.status(500).send("Internal Server Error");
        } else {
          nameUser = rows[0].name;
          Email = rows[0].email;
          connection.query(
            `INSERT INTO request_datas 
                          (name, email, profession, instances, subject, body, date, approve, id_user, url) 
                          VALUES (?,?,?,?,?,?,?,?,?,?)`,
            [
              nameUser,
              Email,
              profession,
              instances,
              subject,
              body,
              date_now,
              0,
              id_user,
              "",
            ],
            function (error, rows, fields) {
              if (error) {
                console.log(error);
              } else {
                res.status(200).json({ keterangan: "berhasil menambah data" });
              }
            }
          );
        }
      }
    );
  });
};


exports.requestDataGuest = async (req, res) => {
  const { name, email, profession, instances, subject, body } = req.body
  if (!name || !email || !profession || !instances || !subject || !body) {
    return res.status(400).json({ status: 400, message: "Field tidak boleh kosong" })
  }
  const qInsertReqData = `INSERT INTO request_datas( name, email, profession, instances, subject, body, approve, id_user,url) VALUES(?,?,?,?,?,?,?,?,?)`
  const vInsertData = [name, email, profession, instances, subject, body, 0, 0, ""]
  connection.query(qInsertReqData, vInsertData,
    (error, rows) => {
      if (error) {
        console.log(error)
        return res.status(400).json({ status: 400, message: "Internal Server Error!" })
      } else {
        return res.status(200).json({ status: 200, message: "Permintaan data diterima, cek berkala email!" })
      }
    }
  )
}