const express = require("express");
const router = express.Router();

const Joi = require("@hapi/joi");
const { joiValidator, defaultSchema } = require("../util/joi_validator");

const authAdmin = require("../middleware/auth_admin");
const decodeToken = require("../middleware/decode_token");

const simpleAsyncDELETE = require("../db/requests/simple_async_delete");
const simpleAsyncInsertAndFetch = require("../db/requests/simple_async_insert_and_fetch");
const simpleAsyncFetch = require("../db/requests/simple_async_fetch");
const simpleAsyncUpdateAndFetch = require("../db/requests/simple_async_update_and_fetch");

// router.get("/:id", async (req, res) => {
//   let { id } = req.params;
//   let sql = `select * from CROP_TYPE where crop_type_id = ${id}`;

//   const callbacks = {
//     onSuccess: (req, res, results) => {
//       return res.status(200).send(results);
//     },
//     onGetConnectionFail: (req, res, err) => {
//       console.log(err);
//       return res.status(500).send([{message:"Internal Server Error"}]);
//     },
//     onFetchFail: (req, res, err) => {
//       console.log(err);
//       return res.status(500).send([{message:"Internal Server Error"}]);
//     },
//     onUnknownError: (req, res, err) => {
//       console.log(err);
//       return res.status(500).send([{message:"Internal Server Error"}]);
//     },
//   };

//   try {
//     await simpleAsyncFetch(sql, req, res, callbacks);
//   } catch (err) {
//     console.log(err);
//   }
//   return;
// });

router.get("/:id?", async (req, res) => {
  const { status: validationStatus, error, value, optionals } = joiValidator([
    {
      schema: {
        ...defaultSchema,
      },
      object: { ...req.query },
    },
    {
      schema: {
        id: Joi.number(),
      },
      object: { ...req.params },
    },
  ]);

  let { crop_class } = value;
  let { id } = value;

  if (!validationStatus) {
    return res
      .status(400)
      .send([{ message: `Invalid Request Format ${optionals.errorList}` }]);
  }

  let sql = "select * from CROP_TYPE";
  let subSql = [];
  if (crop_class) {
    crop_class = crop_class.split(",");
    crop_class = crop_class.map((str) => `"${str}"`);
    crop_class = crop_class.join(",");
    subSql.push(`crop_class IN (${crop_class})`);
  }
  if (id) {
    subSql.push(`crop_type_id = ${id}`);
  }

  if (subSql.length > 0) {
    subSql = subSql.join(" and ");
    sql = `${sql} where ${subSql}`;
  }

  const callbacks = {
    onSuccess: (req, res, results) => {
      return res.status(200).send(results);
    },
    onGetConnectionFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    },
    onFetchFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    },
    onUnknownError: (req, res, err) => {
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    },
  };

  try {
    await simpleAsyncFetch(sql, req, res, callbacks);
  } catch (err) {
    console.log(err);
  }
  return;
});

router.post("/", [decodeToken, authAdmin], async (req, res) => {
  const { status: validationStatus, value, error, optionals } = joiValidator([
    {
      schema: {
        crop_type_name: Joi.any().required(),
        crop_class: Joi.string().default("OTHER"),
      },
      object: { ...req.body },
    },
    {
      schema: {
        ...defaultSchema,
      },
      object: { ...req.body },
    },
  ]);

  if (!validationStatus) {
    return res
      .status(400)
      .send([{ message: `Invalid Request Format ${optionals.errorList}` }]);
  }

  console.log(value);
  let { crop_type_name, crop_class } = value;

  let sql1 = `insert into CROP_TYPE(crop_type_name, crop_class) values("${crop_type_name}","${crop_class}")`;
  let sql2 = `select * from CROP_TYPE where crop_type_id=LAST_INSERT_ID()`;
  let callbacks = {
    onSuccess: (req, res, results) => {
      return res.status(201).send(results);
    },
    onBeginTransactionFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    },
    onInsertFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send([{ message: err.message }]);
    },
    onFetchFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    },
    onCommitFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    },
    onUnknownError: (req, res, err) => {
      console.log(err);
      return res.status(500).send([{ message: err.message }]);
    },
  };
  try {
    await simpleAsyncInsertAndFetch(sql1, sql2, req, res, callbacks);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", [decodeToken, authAdmin], async (req, res) => {
  // let { id } = req.params;

  const { status: valid, value, optionals } = joiValidator([
    {
      schema: { id: Joi.number().min(1).required() },
      object: { ...req.params },
    },
  ]);

  if (!valid) {
    return res
      .status(400)
      .send([{ message: `Invalid Request Format ${optionals.errorList}` }]);
  }

  let { id } = value;

  const sql = `delete from CROP_TYPE where crop_type_id=${id};`;
  const callbacks = {
    onSuccess: (req, res) => {
      return res.status(201).send([{ message: "Crop Deleted Successfully" }]);
    },
    onGetConnectionFail: (req, res, err) => {
      console.log("on get connection fail");
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    },
    onDeleteFail: (req, res, err) => {
      console.log("on delete Fail");
      console.log(err);
      return res.status(500).send([{ message: err.message }]);
    },
  };
  try {
    await simpleAsyncDELETE(sql, req, res, callbacks);
  } catch (err) {
    console.log(err);
  }
});

router.patch("/:id", [decodeToken, authAdmin], async (req, res) => {
  // let { id } = req.params;
  // let { crop_type_name, crop_class } = req.body;

  const { status: valid, value, optionals } = joiValidator([
    {
      schema: { ...defaultSchema },
      object: { ...req.body },
    },
    {
      schema: { id: Joi.number().min(1) },
      object: { ...req.params },
    },
  ]);

  if (!valid) {
  }

  let { id } = value;
  let { crop_type_name, crop_class } = value;

  let subSql = [];
  if (crop_type_name) {
    subSql.push(`crop_type_name="${crop_type_name}"`);
  }
  if (crop_class) {
    subSql.push(`crop_class = "${crop_class}"`);
  }
  subSql = subSql.join(" , ");
  let sql1 = `update CROP_TYPE ${subSql} where crop_type_id=${id}`;
  let sql2 = `select * from CROP_TYPE where crop_type_id=${id}`;
  const callbacks = {
    onSuccess: (req, res, results) => {
      return res.status(201).send(results);
    },
    onBeginTransactionFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    },
    onUpdateFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send([{ message: err.message }]);
    },
    onFetchFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    },
    onCommitFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    },
    onUnknownError: (req, res, err) => {
      console.log(err);
      return res.status(500).send([{ message: err.message }]);
    },
  };
  try {
    await simpleAsyncUpdateAndFetch(sql1, sql2, req, res, callbacks);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
