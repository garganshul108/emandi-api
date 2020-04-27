const express = require("express");
const router = express.Router();
const connectionPool = require("../db/pool");
const authAdmin = require("../middleware/auth_admin");
const decodeToken = require("../middleware/decode_token");

const simpleGET = require("../db/requests/simple_get");

router.post("/", (res, req) => {
  let sql = `select * from VENDOR;`;
  return simpleGET(sql, req, res);
  //   return connectionPool.getConnection((err, connection) => {
  //     if (err) {
  //       console.log("Error while getting connection from the pool");
  //       console.log(err);
  //       return res.status(500).send("Internal Server Error");
  //     }
  //     connection.query(sql, (err, results, fields) => {
  //       if (err) {
  //         console.log("Error while fetching the data from DB");
  //         console.log(err);
  //         return res.status(400).send(err.message);
  //       }
  //       return res.status(200).send(results);
  //     });
  //   });
});

module.exports = router;
