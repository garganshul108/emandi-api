const express = require("express");
const router = express.Router();
const connectionPool = require("../db/pool");

const authAdmin = require("../middleware/auth_admin");
const authVendor = require("../middleware/auth_vendor");
const decodeToken = require("../middleware/decode_token");

const simpleGET = require("../db/requests/simple_get");

const {
  promisifiedQuery,
  promisifiedGetConnection,
  promisifiedBeginTransaction,
  promisifiedRollback,
  promisifiedCommit,
} = require("../db/promisified_sql");

router.get("/crop", (req, res) => {
  let { city_id, state_id } = req.body;
  let sql;
  if (state_id && city_id) {
    sql = `select * from CROP where city_id=${city_id} and state_id=${state_id}`;
  } else if (state_id) {
    sql = `select * from CROP where state_id=${state_id}`;
  } else if (city_id) {
    sql = `select * from CROP where city_id=${city_id}`;
  } else {
    sql = `select * from CROP`;
  }
  return simpleGET(sql, req, res);
});
module.exports = router;
