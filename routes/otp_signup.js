const express = require("express");
const router = express.Router();
const connectionPool = require("../db/pool");
const sendOTP = require("../util/otp_service");
const jwt = require("../util/jwt");
const otpGenerator = require("../util/otp_generator");

router.get("/", (req, res) => {
  const { contact, type } = req.query;
  if (!contact || !type) {
    return res
      .status(400)
      .send('"type" and "contact" all/any one not specified');
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

router.post("/", (req, res) => {
  const { contact, otp, type, device_fcm_token } = req.body;
  console.log("incoming", req.body);
  if (!contact || !otp || !type || !device_fcm_token) {
    return res
      .status(400)
      .send(
        '"type", "otp", "contact", "device_fcm_token" maybe all or any one not specified'
      );
  }

  return connectionPool.getConnection((err, connection) => {
    if (err) {
      console.log("Error in getting connection");
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
    return connection.beginTransaction((err) => {
      if (err) {
        console.log("Error while beginning transaction");
        console.log(err);
        connection.release();
        return res.status(500).send("Internal Server Error");
      }
      let sql1 = `select * from OTP_SIGNUP where contact=${contact}`;
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
          return res
            .status(404)
            .send("Not a valid OTP. OTP may be expired/not registered");
        }
        const result = results[results.length - 1];
        console.log("result", result);
        if (otp === result.otp) {
          let payload = {
            contact: contact,
            type: type,
            device_fcm_token: device_fcm_token,
          };

          let sql2, sql3;
          if (type === "vendor") {
            payload = {
              ...payload,
              vendor_id: result.subscriber_id,
              isVendor: 1,
            };
            sql2 = `insert into VENDOR(contact) VALUES(${contact})`;
            sql3 = "select LAST_INSERT_ID() as vendor_id from VENDOR";
          } else if (type === "user") {
            payload = {
              ...payload,
              vendor_id: result.subscriber_id,
              isUser: 1,
            };
            sql2 = `insert into USER(contact) VALUES(${contact})`;
            sql3 = "select LAST_INSERT_ID() as user_id from USER";
          } else {
            return res.status(400).send('"type" specified is not correct');
          }

          connection.query(sql2, (err, results, fields) => {
            if (err) {
              console.log(`Error while registering ${type} via OTP`);
              console.log(err);
              connection.rollback(() => {
                connection.release();
              });
              return res.status(400).send(err.message);
            }
            connection.query(sql3, (err, results, fields) => {
              if (err) {
                console.log(`Error while retrieving ${type}_id`);
                console.log(err);
                connection.rollback(() => {
                  connection.release();
                });
                return res.status(500).send("Internal Server Error");
              }
              const result = results[0];
              if (type === "vendor") {
                payload = { ...payload, vendor_id: result.vendor_id };
              } else if (type === "user") {
                payload = { ...payload, user_id: result.user_id };
              }
              const token = jwt.generateToken(payload);
              return connection.commit((err) => {
                if (err) {
                  connection.rollback(() => {
                    connection.release();
                  });
                  return res.status(500).send("Error while commiting changes");
                }
                connection.release();

                return res
                  .header("x-auth-token", token)
                  .status(201)
                  .send("Signup Successful!");
              });
            });
          });
        }
        return res.status(404).send("Incorrect OTP");
      });
    });
  });
});

module.exports = router;
