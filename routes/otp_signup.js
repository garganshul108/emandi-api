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
  if (!contact || !type) {
    return res
      .status(400)
      .send('"type" and "contact" all/any one not specified');
  }
  if (typeof contact !== "number") {
    contact = parseInt(contact);
  }
  let sql1, sql2;
  const otp = otpGenerator();
  if (type === "vendor") {
    sql1 = `select vendor_id from VENDOR where contact=${contact};`;
    sql2 = `insert into OTP_SIGNUP(subscriber_type, contact, otp) values ("vendor", ${contact}, ${otp});`;
  } else if (type === "user") {
    sql1 = `select user_id from USER where contact=${contact};`;
    sql2 = `insert into OTP_SIGNUP(subscriber_type, contact, otp) values ("user", ${contact}, ${otp});`;
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
        return res.status(500).send("Error occured while quering");
      }
      if (results.length > 0) {
        connection.release();
        return res.status(400).send("Already registered!");
      }

      (async (req, res, connection) => {
        try {
          await sendOTP(contact, "otp-template-2", `${contact}|${otp}`);
          return connection.query(sql2, (err, results, fields) => {
            if (err) {
              console.log("Error while registering OTP");
              console.log(err);
              connection.release();
              return res.status(400).send(err.message);
            }
            connection.release();
            return res.status(201).send("OTP send and registered");
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
  let errorOnBeginTransaction = true;
  let errorOnCommit = true;
  let errorOnFetchingLastInsertId = true;
  let errorOnFetchingOTPfromSignupTable = true;
  let errorOnInsertingIntoMainTable = true;
  let sql1 = `select * from OTP_SIGNUP where contact=${contact} ORDER BY reg_timestamp DESC`;
  let sql2, sql3;

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
    errorOnFetchingOTPfromSignupTable = false;
    if (matchingContacts.length < 1) {
      // rollback
      connection.release();
      return res.status(404).send("OTP not registered / expired");
    }
    let latestOTPResult = matchingContacts[0];
    if (!otp === latestOTPResult.otp) {
      // rollback
      connection.release();
      return res.status(404).send("Latest OTP did not match");
    }
    if (type === "vendor") {
      sql2 = `insert into VENDOR(contact, device_fcm_token) VALUES(${contact}, "${device_fcm_token}")`;
      sql3 = "select LAST_INSERT_ID() as id from VENDOR";
    } else if (type === "user") {
      sql2 = `insert into USER(contact, device_fcm_token) VALUES(${contact}, "${device_fcm_token}")`;
      sql3 = "select LAST_INSERT_ID() as id from USER";
    }
    await promisifiedBeginTransaction(connection);
    errorOnBeginTransaction = false;
    await promisifiedQuery(connection, sql2, []);
    errorOnInsertingIntoMainTable = false;
    let { results: idPacket } = await promisifiedQuery(connection, sql3, []);
    errorOnFetchingLastInsertId = false;
    await promisifiedCommit(connection);
    errorOnCommit = false;
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
      .send("Successfully signed up via OTP");
  } catch (err) {
    if (!connection) {
      console.log(__filename + " Error in fetching connection");
      console.log(err);
      return res.status(500).send("Internal Server Error");
    } else if (errorOnFetchingOTPfromSignupTable) {
      console.log(__filename + " Error in fetching OTP from Signup table");
      console.log(err);
      connection.release();
      return res.status(500).send("Internal Server Error");
    } else if (errorOnBeginTransaction) {
      console.log(__filename + " Error in beginning transaction");
      console.log(err);
      connection.release();
      return res.status(500).send("Internal Server Error");
    } else if (errorOnInsertingIntoMainTable) {
      console.log(__filename + ` Error in Inserting into ${type} table`);
      console.log(err);
      connection.rollback(() => {
        connection.release();
      });
      return res.status(400).send(err.message);
    } else if (errorOnFetchingLastInsertId) {
      console.log(__filename + " Error in fetching last index of table");
      console.log(err);
      connection.rollback(() => {
        connection.release();
      });
      return res.status(500).send("Internal Server Error");
    } else if (errorOnCommit) {
      console.log(__filename + " Error on Commit");
      console.log(err);
      connection.rollback(() => {
        connection.release();
      });
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
