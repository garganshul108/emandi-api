const express = require("express");
const router = express.Router();
const connectionPool = require("../db/pool");
const sendOTP = require("../util/sendOTP");
const { compare } = require("../util/hash");
const jwt = require("../util/jwt");

router.get("/", (req, res) => {
  const { contact, type } = req.query;
  // console.log(req.query);
  if (!contact || !type) {
    res.status(400).send('"type" and "contact" both/one not specified');
  }
  if (type === "vendor") {
    return connectionPool.getConnection((err, connection) => {
      if (err) {
        console.log("Error in getting connection");
        console.log(err);
        return res.status(500).send("Internal Server Error");
      }
      let sql = `select vendor_id from VENDOR where contact=${contact};`;
      return connection.query(sql, (err, results, fields) => {
        if (err) {
          console.log("Error while quering for id");
          console.log(err);
          connection.release();
          return res.status(500).send("Error occured while quering");
        }
        if (results.length <= 0) {
          connection.release();
          return res.status(404).send("Unregistered Vendor");
        }
        vendor_id = results[0].vendor_id;
        const otp = Math.floor(10000 + Math.random() * 90000);
        (async (req, res, connection) => {
          try {
            await sendOTP(contact, "otp-template-2", `${contact}|${otp}`);
            let sql2 = `insert into OTP_LOGIN(subscriber_type, subscriber_id, contact, otp) values ("vendor",${vendor_id}, ${contact}, ${otp});`;
            return connection.query(sql2, (err, results, fields) => {
              if (err) {
                console.log("Error while registering OTP");
                console.log(err);
                return res.status(500).send("Internal Server Error, OTP");
              }
              return res.status(201).send("OTP send and registered");
            });
          } catch (ex) {
            return res.status(500).send("Error while sending the OTP");
          }
        })(req, res, connection);
      });
    });
  } else if (type === "user") {
  }

  return res.status(400).send('"type" specified is not correct');
});

router.post("/", (req, res) => {
  const { contact, otp, type } = req.body;
  console.log("incoming", req.body);
  if (!contact || !otp || !type) {
    return res
      .status(400)
      .send('"type", "otp" and "contact" all or any one not specified');
  }

  return connectionPool.getConnection((err, connection) => {
    if (err) {
      console.log("Error in getting connection");
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
    let sql = `select * from OTP_LOGIN where contact=${contact}`;
    return connection.query(sql, (err, results, fields) => {
      if (err) {
        console.log("Error occured while Quering");
        console.log(err);
        return res.status(500).send("Internal Server Error");
      }
      if (results.length <= 0) {
        return res.status(404).send("OTP Expired");
      }
      const result = results[results.length - 1];
      console.log("result", result);
      if (otp === result.otp) {
        let payload = {
          contact: contact,
          type: type,
        };

        if (type === "vendor") {
          payload = {
            ...payload,
            vendor_id: result.subscriber_id,
            isVendor: 1,
          };
        } else if (type === "user") {
          payload = { ...payload, user_id: result.subscriber_id, isUser: 1 };
        } else if (type === "admin") {
          payload = { ...payload, admin_id: result.subscriber_id, isAdmin: 1 };
        }

        const token = jwt.generateToken(payload);
        return res
          .header("x-auth-token", token)
          .status(201)
          .send("Login Successful!");
      }
      return res.status(404).send("Incorrect OTP");
    });
  });
});

module.exports = router;
