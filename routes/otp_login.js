const express = require("express");
const router = express.Router();
const connectionPool = require("../db/pool");
const sendOTP = require("../util/otp_service");
const jwt = require("../util/jwt");
const otpGenerator = require("../util/otp_generator");

router.get("/", (req, res) => {
  const { contact, type } = req.query;
  // console.log(req.query);
  if (!contact || !type) {
    return res.status(400).send('"type" and "contact" both/one not specified');
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

router.post("/", (req, res) => {
  const { contact, otp, type, device_fcm_token } = req.body;
  console.log("incoming", req.body);
  if (!contact || !otp || !type || !device_fcm_token) {
    return res
      .status(400)
      .send(
        '"type", "otp", "contact", "device_fcm_token" all or any one not specified'
      );
  }

  return connectionPool.getConnection((err, connection) => {
    if (err) {
      console.log("Error in getting connection");
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
    connection.beginTransaction((err) => {
      if (err) {
        console.log("Error while beginning transaction");
        console.log(err);
        connection.release();
        return res.send(500).send("Internal Server Error");
      }
      let sql1 = `select * from OTP_LOGIN where contact=${contact}`;
      return connection.query(sql1, (err, results, fields) => {
        if (err) {
          console.log("Error occured while Quering");
          console.log(err);
          connection.rollback(() => {
            connection.release();
          });
          return res.status(500).send("Internal Server Error");
        }
        if (results.length <= 0) {
          connection.rollback(() => {
            connection.release();
          });
          return res.status(404).send("OTP expired/not registered");
        }
        const result = results[results.length - 1];
        console.log("result", result);
        if (otp === result.otp) {
          let payload = {
            contact: contact,
            type: type,
            device_fcm_token: device_fcm_token,
          };

          let sql2;
          if (type === "vendor") {
            payload = {
              ...payload,
              vendor_id: result.subscriber_id,
              isVendor: 1,
            };
            sql2 = "select vendor_id from VENDOR where contact=${contact}";
          } else if (type === "user") {
            payload = { ...payload, user_id: result.subscriber_id, isUser: 1 };
            sql2 = "select user_id from USER where contact=${contact}";
          } else {
            connection.rollback(() => {
              connection.release();
            });
            return res.status(400).send('Invalid "type" specified');
          }

          connection.query(sql2, (err, results, fields) => {
            if (err) {
              connection.rollback(() => {
                connection.release();
              });
              return res.status(500).send(err.message);
            }
            const result = results[0];
            if (type === "vendor") {
              let vendor_id = result.vendor_id;
              payload = { ...payload, vendor_id };
            } else if (type === "user") {
              let user_id = result.user_id;
              payload = { ...payload, user_id };
            }

            connection.commit((err) => {
              if (err) {
                console.log("Error while Commiting");
                console.log(err);
                res.status(500).send("Internal Server Error");
              }

              const token = jwt.generateToken(payload);
              connection.release();
              return res
                .header("x-auth-token", token)
                .status(201)
                .send("Login Successful!");
            });
          });
        }
        connection.release();
        return res.status(404).send("Incorrect OTP");
      });
    });
  });
});

module.exports = router;
