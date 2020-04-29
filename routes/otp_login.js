const express = require("express");
const router = express.Router();
const connectionPool = require("../db/pool");
const sendOTP = require("../util/otp_service");
const jwt = require("../util/jwt");
const otpGenerator = require("../util/otp_generator");

const {
  promisifiedQuery,
  promisifiedGetConnection,
  promisifiedBeginTransaction,
  promisifiedRollback,
  promisifiedCommit,
} = require("../db/promisified_sql");

router.get("/", (req, res) => {
  let { contact, type } = req.query;
  // console.log(req.query);
  if (!contact || !type) {
    return res.status(400).send('"type" and "contact" both/one not specified');
  }
  if (typeof contact !== "number") {
    contact = parseInt(contact);
  }
  const otp = otpGenerator();
  let sql1, sql2;
  if (type === "vendor") {
    sql1 = `select vendor_id from VENDOR where contact=${contact};`;
  } else if (type === "user") {
    sql1 = `select user_id from USER where contact=${contact};`;
  } else {
    return res.status(400).send('"type" specified is not correct');
  }

  return connectionPool.getConnection((err, connection) => {
    if (err) {
      console.log("Error in getting connection");
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
    return connection.query(sql1, (err, results, fields) => {
      if (err) {
        console.log("Error while quering for id");
        console.log(err);
        connection.release();
        return res.status(500).send(err.message);
      }
      if (results.length <= 0) {
        connection.release();
        return res
          .status(404)
          .send(`You are not registered as ${type} with ${contact}`);
      }
      if (type === "vendor") {
        vendor_id = results[0].vendor_id;
        sql2 = `insert into OTP_LOGIN(subscriber_type, subscriber_id, contact, otp) values ("vendor",${vendor_id}, ${contact}, ${otp});`;
      } else if (type === "user") {
        user_id = results[0].user_id;
        sql2 = `insert into OTP_LOGIN(subscriber_type, subscriber_id, contact, otp) values ("user",${user_id}, ${contact}, ${otp});`;
      }
      (async (req, res, connection) => {
        try {
          await sendOTP(contact, "otp-template-2", `${contact}|${otp}`);
          return connection.query(sql2, (err, results, fields) => {
            if (err) {
              console.log("Error while registering OTP");
              console.log(err);
              connection.release();
              return res.status(500).send("Internal Server Error, OTP");
            }
            connection.release();
            return res.status(201).send("OTP sent and registered");
          });
        } catch (ex) {
          connection.release();
          return res.status(500).send("Error while sending the OTP");
        }
      })(req, res, connection);
    });
  });
});

router.post("/", async (req, res) => {
  const { contact, otp, type, device_fcm_token } = req.body;
  console.log(__filename + " incoming", req.body);
  if (!contact || !otp || !type || !device_fcm_token) {
    return res
      .status(400)
      .send(
        '"type", "otp", "contact", "device_fcm_token" maybe all or any one not specified'
      );
  }
  console.log(`${__filename} type of type ${typeof type}: ${type}`);
  if (!(type === "vendor" || type === "user")) {
    return res.status(400).send('"type" specified is not correct');
  }

  let connection = undefined;
  let errorOnFetchingId = true;
  let errorOnFetchingOTPfromLoginTable = true;
  let sql1 = `select * from OTP_LOGIN where contact=${contact} and subscriber_type="${type}" ORDER BY reg_timestamp DESC`;
  let sql2;

  if (type === "vendor") {
    sql2 = `select vendor_id as id from VENDOR where contact=${contact}`;
  } else if (type === "user") {
    sql2 = `select user_id as id from USER where contact=${contact}`;
  }
  let payload = {
    contact: contact,
    device_fcm_token: device_fcm_token,
  };
  try {
    connection = await promisifiedGetConnection(connectionPool);
    let { results: matchingContacts } = await promisifiedQuery(
      connection,
      sql1
    );
    errorOnFetchingOTPfromLoginTable = false;
    if (matchingContacts.length < 1) {
      // rollback
      connection.release();
      return res.status(404).send("OTP not registered / expired");
    }
    let latestOTPResult = matchingContacts[0];
    console.log(__filename, latestOTPResult);
    console.log(otp, latestOTPResult.otp);
    if (otp !== latestOTPResult.otp) {
      // rollback
      console.log(__filename, "otp do not match");
      connection.release();
      return res.status(404).send("Latest OTP did not match");
    }
    let { results: idPacket } = await promisifiedQuery(connection, sql2, []);
    errorOnFetchingId = false;
    if (type === "vendor") {
      payload = {
        ...payload,
        vendor_id: idPacket[0].id,
        isVendor: 1,
      };
    } else if (type === "user") {
      payload = {
        ...payload,
        user_id: idPacket[0].id,
        isUser: 1,
      };
    }
    console.log(__filename + "payload", payload);
    const token = jwt.generateToken(payload);
    connection.release();
    return res
      .header("x-auth-token", token)
      .status(201)
      .send("Successfully logged in via OTP");
  } catch (err) {
    if (!connection) {
      console.log(__filename + " Error in fetching connection");
      console.log(err);
      return res.status(500).send("Internal Server Error");
    } else if (errorOnFetchingOTPfromLoginTable) {
      console.log(__filename + " Error in fetching OTP from Login table");
      console.log(err);
      connection.release();
      return res.status(500).send("Internal Server Error");
    } else if (errorOnFetchingId) {
      console.log(__filename + " Error in fetching index");
      console.log(err);
      connection.release();
      return res.status(500).send("Internal Server Error");
    } else {
      console.log(__filename + " UNKNOWN ERROR");
      console.log(err);
      connection.release();
      return res.status(500).send("Internal Server Error");
    }
  }
});

module.exports = router;
