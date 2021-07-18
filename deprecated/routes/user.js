const express = require("express");
const router = express.Router();
const connectionPool = require("../db/pool");

const Joi = require("@hapi/joi");
const { joiValidator, defaultSchema } = require("../util/joi_validator");

const user_cart = require("./user_cart");

const authAdmin = require("../middleware/auth_admin");
const authUser = require("../middleware/auth_user");
const decodeToken = require("../middleware/decode_token");

const simpleGET = require("../db/requests/simple_get");

const {
  promisifiedQuery,
  promisifiedGetConnection,
  promisifiedBeginTransaction,
  promisifiedRollback,
  promisifiedCommit,
} = require("../db/promisified_sql");

router.use("/cart", user_cart);

router.get("/me", [decodeToken, authUser], (req, res) => {
  let user_id = req.actor.user_id;
  let sql = `select * from USER where user_id=${user_id}`;
  return simpleGET(sql, req, res);
});

router.get("/:id", [decodeToken, authAdmin], (req, res) => {
  let user_id = req.params.id;
  const { status: valid, optionals } = joiValidator([
    { schema: { ...defaultSchema }, object: { user_id } },
  ]);
  if (!valid) {
    return res
      .status(400)
      .send([{ message: `Invalid Request Format ${optionals.errorList}` }]);
  }
  let sql = `select * from USER where user_id=${user_id}`;
  return simpleGET(sql, req, res);
});

router.get("/", (req, res) => {
  let sql = `select * from USER;`;
  return simpleGET(sql, req, res);
});

router.patch("/me", [decodeToken, authUser], async (req, res) => {
  let {
    name,
    state_id,
    city_id,
    pin_code,
    address,
    profile_picture,
  } = req.body;

  const { status: valid, optionals } = joiValidator([
    {
      schema: { ...defaultSchema },
      object: { ...req.body },
    },
  ]);

  if (!valid) {
    return res
      .status(400)
      .send([{ message: `Invalid Request Format ${optionals.errorList}` }]);
  }

  if (
    !name &&
    !state_id &&
    !city_id &&
    !pin_code &&
    !address &&
    !profile_picture
  ) {
    return res
      .status(400)
      .send([{ message: "No argument is specified to be changed" }]);
  }

  let user_id = req.actor.user_id;
  let subSql = [];

  if (name) {
    subSql.push(` name = "${name}" `);
  }
  if (state_id) {
    subSql.push(` state_id = ${state_id} `);
  }
  if (city_id) {
    subSql.push(` city_id = ${city_id} `);
  }
  if (pin_code) {
    subSql.push(` pin_code = "${pin_code}" `);
  }
  if (address) {
    subSql.push(` address = "${address}" `);
  }
  if (profile_picture) {
    subSql.push(` profile_picture = "${profile_picture}" `);
  }
  subSql = subSql.join();
  let sql1 = `update USER set ${subSql} where user_id=${user_id}`;
  let sql2 = `select * from USER where user_id=${user_id}`;
  let connection = null;
  let errorOnSelectQuery = true;
  let errorOnUpdateQuery = true;
  try {
    connection = await promisifiedGetConnection(connectionPool);
    await promisifiedQuery(connection, sql1, []);
    errorOnUpdateQuery = false;
    const { results } = await promisifiedQuery(connection, sql2, []);
    errorOnSelectQuery = false;
    connection.release();
    return res.status(201).send(results);
  } catch (err) {
    if (!connection) {
      console.log("Error while getting connetion");
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    } else if (errorOnUpdateQuery) {
      console.log("Error while Updating Table");
      console.log(err);
      connection.release();
      return res.status(500).send([{ message: "Internal Server Error" }]);
    } else if (errorOnSelectQuery) {
      console.log("Error while getting User");
      console.log(err);
      connection.release();
      return res.status(500).send([{ message: "Internal Server Error" }]);
    } else {
      console.log("UNKNOWN ERROR");
      console.log(err);
      connection.release();
      return res.status(500).send([{ message: "Internal Server Error" }]);
    }
  }
});

router.delete("/me", [decodeToken, authUser], async (req, res) => {
  let user_id = req.actor.user_id;
  const { status: valid, optionals } = joiValidator([
    {
      schema: { ...defaultSchema },
      object: { ...req.actor },
    },
  ]);

  if (!valid) {
    return res
      .status(400)
      .send([{ message: `Invalid Request Format ${optionals.errorList}` }]);
  }

  let sql1 = `DELETE from USER where user_id=${user_id}`;
  let connection = null;
  let errorOnDelete = true;
  try {
    connection = await promisifiedGetConnection(connectionPool);
    await promisifiedQuery(connection, sql1, []);
    errorOnDelete = false;
    connection.release();
    return res.status(201).send([{ message: "Account Deleted" }]);
  } catch (err) {
    if (!connection) {
      console.log("Error on getting connection");
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    } else if (errorOnDelete) {
      console.log("Error on Delete");
      console.log(err);
      connection.release();
      return res.status(500).send([{ message: "Internal Server Error" }]);
    } else {
      console.log("UNKNOWN ERROR");
      console.log(err);
      connection.release();
      return res.status(500).send([{ message: "Internal Server Error" }]);
    }
  }
});

module.exports = router;
