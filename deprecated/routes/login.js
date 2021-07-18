const express = require("express");
const router = express.Router();
const connectionPool = require("../db/pool");
const { compare } = require("../util/hash");
const jwt = require("../util/jwt");

const Joi = require("@hapi/joi");
const { joiValidator, defaultSchema } = require("../util/joi_validator");

router.post("/", (req, res) => {
  // const { type, username, password } = req.body;

  const { status: valid, optionals, value } = joiValidator([
    {
      schema: {
        username: Joi.required(),
        password: Joi.required(),
        type: Joi.required(),
      },
      object: { ...req.body },
    },
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

  const { type, username, password } = value;
  // console.log(req.body);/
  if (type === "admin") {
    // console.log("admin cnrf");
    const sql = `select password from ADMIN where admin_name = "${username}"`;
    return connectionPool.getConnection((err, connection) => {
      if (err) {
        console.log("Error while getting connection from pool");
        return res.status(500).send([{ message: "Intenal Server error" }]);
      }
      return connection.query(sql, (err, results, fields) => {
        if (err) {
          connection.release();
          return res.status(400).send(err);
        }
        if (results.length < 1) {
          connection.release();
          return res.status(404).send([{ message: "Invalid Credentials" }]);
        }
        // console.log("Error passes");

        return (async () => {
          try {
            const hashedValue = results[0].password;
            // console.log("hashed", hashedValue);
            const match = await compare(password, hashedValue);
            // console.log(match);
            if (!match) {
              connection.release();
              return res.status(400).send([{ message: "Invalid Credentials" }]);
            }
            // console.log("matched");
            const payload = {
              isAdmin: 1,
              name: username,
            };
            const token = jwt.generateToken(payload);
            // console.log(token);
            connection.release();
            return res
              .header("x-auth-token", token)
              .status(201)
              .send([
                { message: `Successfully Logged in as Admin: ${username}` },
              ]);
          } catch (ex) {
            console.log("Error: ", ex.message, ex);
            connection.release();
            return res.status(500).send([{ message: "Internal Server Error" }]);
          }
        })();
      });
    });
  } else if (type === "vendor") {
    // TBI
    return res.status(400).send([{ message: "Facility Not available" }]);
  } else if (type === "user") {
    //TBI
    return res.status(400).send([{ message: "Facility Not available" }]);
  }

  return res.status(400).send([{ message: "Invalid Request Format" }]);
});

module.exports = router;
