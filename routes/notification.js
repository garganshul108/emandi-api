const router = require("express").Router();
const connectionPool = require("../db/pool");
const {
  promisifiedGetConnection,
  promisifiedQuery,
} = require("../db/promisified_sql");

const Joi = require("@hapi/joi");
const { joiValidator, defaultSchema } = require("../util/joi_validator");

const decodeToken = require("../middleware/decode_token");
const authVendor = require("../middleware/auth_vendor");
const authUser = require("../middleware/auth_user");

const sendNotification = require("../util/push-notification-service/push-notifier");

router.post("/vendor", [decodeToken, authUser], async (req, res) => {
  const { vendor_id, message } = req.body;

  const { status: validationStatus, error, value, optionals } = joiValidator([
    {
      schema: {
        ...defaultSchema,
      },
      object: { ...req.body },
    },
    {
      schema: {
        message: Joi.string().min(2),
      },
      object: { ...req.body },
    },
  ]);

  if (!validationStatus) {
    return res
      .status(400)
      .send([{ message: `Invalid Request Format ${optionals.errorList}` }]);
  }

  let sql = `select device_fcm_token from VENDOR where vendor_id=${vendor_id}`;
  try {
    const connection = promisifiedGetConnection(connectionPool);
    const { results } = promisifiedQuery(connection, sql, []);
    const token = results[0]["device_fcm_token"];
    await sendNotification(token, message);
    connection.release();
    return res.status(201).send([{ message: "Message delivered" }]);
  } catch (e) {
    console.log(e);
    if (connection) connection.release();
    return res.status(500).send([{ message: e.message }]);
  }
});

router.post("/user", [decodeToken, authVendor], async (req, res) => {
  const { user_id, message } = req.body;

  const { status: validationStatus, error, value, optionals } = joiValidator([
    {
      schema: {
        ...defaultSchema,
      },
      object: { ...req.body },
    },
    {
      schema: {
        message: Joi.string().min(2),
      },
      object: { ...req.body },
    },
  ]);

  if (!validationStatus) {
    return res
      .status(400)
      .send([{ message: `Invalid Request Format ${optionals.errorList}` }]);
  }

  let sql = `select device_fcm_token from USER where vendor_id=${user_id}`;
  try {
    const connection = promisifiedGetConnection(connectionPool);
    const { results } = promisifiedQuery(connection, sql, []);
    const token = results[0]["device_fcm_token"];
    await sendNotification(token, message);
    connection.release();
    return res.status(201).send([{ message: "Message delivered" }]);
  } catch (e) {
    console.log(e);
    if (connection) connection.release();
    return res.status(500).send([{ message: e.message }]);
  }
});

module.exports = router;
