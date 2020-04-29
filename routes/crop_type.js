const express = require("express");
const router = express.router();

const authAdmin = require("../middleware/auth_admin");
const decodeToken = require("../middleware/decode_token");

const simpleAsyncDELETE = require("../db/requests/simple_async_delete");
const simpleAsyncInsertAndFetch = require("../db/requests/simple_async_insert_and_fetch");
const simpleAsyncFetch = require("../db/requests/simple_async_fetch");
const simpleAsyncUpdateAndFetch = require("../db/requests/simple_async_update_and_fetch");


router.get("/:id", async(req, res) => {
  let { id } = req.params;
  let sql = `select * from crop_type where crop_type_id = ${id}`;

  const callbacks = {
    onSuccess: (req, res, results) => {
      return res.status(200).send(results);
    },
    onGetConnectionFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    },
    onFetchFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    },
    onUnknownError: (req, res, err) => {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    },
  };

  try {
    await simpleAsyncFetch(sql, req, res, callbacks);
  } catch (err) {
    console.log(err);
  }
  return;
});

router.get("/", async (req, res) => {
  let { crop_class } = req.query;
  let sql = "select * from crop_type";
  if (crop_class) {
    crop_class = crop_class.split(",");
    crop_class = crop_class.map((str) => `"${str}"`);
    crop_class = crop_class.join(",");
    sql = `${sql} where crop_class IN (${crop_class})`;
  }

  const callbacks = {
    onSuccess: (req, res, results) => {
      return res.status(200).send(results);
    },
    onGetConnectionFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    },
    onFetchFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    },
    onUnknownError: (req, res, err) => {
      console.log(err);
      return res.status(500).send("Internal Server Error");
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
  let { crop_type_name, crop_class } = req.body;
  let sql1 = `insert into CROP_TYPE(crop_type_name, crop_type_class) values("${crop_type_name}","${crop_class}")`;
  let sql2 = `select * from CROP_TYPE where id=LAST_INSERT_ID()`;
  let callbacks = {
    onSuccess: (req, res, results) => {
      return res.status(201).send(results);
    },
    onBeginTransactionFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    },
    onInsertFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send(err.message);
    },
    onFetchFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    },
    onCommitFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    },
    onUnknownError: (req, res, err) => {
      console.log(err);
      return res.status(500).send(err.message);
    },
  };
  try{
  await simpleAsyncInsertAndFetch(sql1, sql2, req, res, callbacks);
  } catch(err) {
    console.log(err);
  }
});

router.delete("/:id", [decodeToken, authAdmin], (req, res) => {
  let { id } = req.params;
  const sql = `delete from CROP_TYPE where crop_type_id=${id};`;
  const callbacks = {
    onSuccess: (req, res) => {
      return res.status(201).send("Crop Deleted Successfully");
    },
    onGetConnectionFail: (req, res, err) => {
      console.log("on get connection fail");
      console.log(err);
      return res.status(500).send("Internal Server Error");
    },
    onDeleteFail: (req, res, err) => {
      console.log("on delete Fail");
      console.log(err);
      return res.status(500).send(err.message);
    },
  };
  try{
   await simpleAsyncDELETE(sql, req, res, callbacks);
  } catch(err) {
    console.log(err);
  }
});

router.patch("/:id", [decodeToken, authAdmin], async (req, res) => {
  let {id} = req.params;
  let {crop_type_name, crop_class} = req.body;
  let subSql = [];
  if(crop_type_name){
    subSql.push(`crop_type_name="${crop_type_name}"`)
  }
  if(crop_class){
    subSql.push(`crop_class = "${crop_class}"`);
  }
  subSql = subSql.join(' , ');
  let sql1 = `update CROP_TYPE ${subSql} where crop_type_id=${id}`;
  let sql2 = `select * from crop_type where crop_type_id=${id}`;
  const callbacks = {
    onSuccess: (req, res, results) => {
      return res.status(201).send(results);
    },
    onBeginTransactionFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    },
    onUpdateFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send(err.message);
    },
    onFetchFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    },
    onCommitFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send("Internal Server Error");
    },
    onUnknownError: (req, res, err) => {
      console.log(err);
      return res.status(500).send(err.message);
    }
  };
  try{
    await simpleAsyncUpdateAndFetch(sql1, sql2, req, res, callbacks);
  }catch(err){
    console.log(err);
  }
});

module.exports = router;
