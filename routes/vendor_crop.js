const express = require("express");
const router = express.Router();
const connectionPool = require("../db/pool");

const authAdmin = require("../middleware/auth_admin");
const authVendor = require("../middleware/auth_vendor");
const decodeToken = require("../middleware/decode_token");

const simpleGET = require("../db/requests/simple_get");
const simpleDELETE = require("../db/requests/simple_get");

const simpleAsyncUpdateAndFetch = require("../db/requests/simple_async_update_and_fetch");

const {
  promisifiedQuery,
  promisifiedGetConnection,
  promisifiedBeginTransaction,
  promisifiedRollback,
  promisifiedCommit,
} = require("../db/promisified_sql");

router.get("/:crop_id", [decodeToken, authVendor], (req, res) => {
  let crop_id = req.params.crop_id;
  let sql = `select * from CROP where crop_id=${crop_id}`;
  return simpleGET(sql, req, res);
});

// crop table to be implemented

router.get("/", [decodeToken, authVendor], (req, res) => {
  let vendor_id = req.actor.vendor_id;
  let sql = `select * from CROP where vendor_id=${vendor_id}`;
  return simpleGET(sql, req, res);
});

router.delete("/:crop_id", [decodeToken, authVendor], (req, res) => {
  let crop_id = req.param.crop_id;
  let sql = `delete from crop where crop_id=${crop_id}`;
  return simpleDELETE(sql, req, res, () => {
    return res.status(200).send("Crop Deleted Successfully");
  });
});

router.delete("/", [decodeToken, authVendor], (req, res) => {
  let crop_ids = req.query.id;
  let sql = `delete from crop where crop_id IN (${crop_ids})`;
  return simpleDELETE(sql, req, res, () => {
    return res.status(200).send("Crops Deleted Successfully");
  });
});

router.post("/", [decodeToken, authVendor], async (req, res) => {
  let vendor_id = req.actor.vendor_id;
  let {
    qty,
    crop_name,
    crop_type_id,
    packed_date,
    exp_date,
    description,
  } = req.body;
  if (!qty || !crop_name || !crop_type_id) {
    return res
      .status(400)
      .send(
        '"qty", "crop_name" and "crop_type_id" all or any one not specified'
      );
  }

  if (!packed_date) {
    packed_date = "NOW()";
  } else {
    packed_date = `"${packed_date}"`;
  }
  if (!exp_date) {
    exp_date = "NULL";
  }
  if (!description) {
    description = "NULL";
  }

  let sql1 = `insert into CROP(vendor_id, qty, crop_name, crop_type_id, packed_date, exp_date, description) values (${vendor_id},${qty},"${crop_name}",${crop_type_id},${packed_date},"${exp_date}","${description}")`;
  let sql2 = `select * from CROP where crop_id=LAST_INSERT_ID()`;
  let connection;
  let errorOnBeginTransaction = true;
  let errorOnCommit = true;
  let errorOnFetchLastCrop = true;
  let errorOnInsertCrop = true;
  try {
    connection = await promisifiedGetConnection(connectionPool);
    await promisifiedBeginTransaction(connection);
    errorOnBeginTransaction = false;
    await promisifiedQuery(connection, sql1, []);
    errorOnInsertCrop = false;
    let { results: cropInserted } = await promisifiedQuery(
      connection,
      sql2,
      []
    );
    errorOnFetchLastCrop = false;
    await promisifiedCommit(connection);
    errorOnCommit = false;
    connection.release();
    return res.status(201).send(cropInserted);
  } catch (err) {
    if (!connection) {
      console.log("Error on getting connection");
      console.log(err);
      return res.status(500).send("Internal Server Error");
    } else if (errorOnBeginTransaction) {
      console.log("Error on begin transaction");
      console.log(err);
      connection.release();
      return res.status(500).send("Internal Server Error");
    } else if (errorOnInsertCrop) {
      console.log("Error on inserting Crop");
      console.log(err);
      connection.release();
      return res.status(400).send(err.message);
    } else if (errorOnFetchLastCrop) {
      console.log("Error on fetching Crop");
      console.log(err);
      connection.release();
      return res.status(500).send("Internal Server Error");
    } else if (errorOnCommit) {
      console.log("Error on Commit");
      console.log(err);
      connection.release();
      return res.status(500).send("Internal Server Error");
    } else {
      console.log("UNKNOWN ERROR");
      console.log(err);
      connection.release();
      return res.status(500).send("Internal Server Error");
    }
  }
});


router.patch("/:crop_id",[decodeToken, authVendor], (req, res) => {
  let {crop_id} = req.params;
  let {
    changeInQty,
    crop_name,
    crop_type_id,
    packed_date,
    exp_date,
    description,
  } = req.body

  if(!changeInQty && !crop_name && !crop_type_id && !packed_date && !exp_date && !description){
    return res.status(400).send("No attributes specified to be changed");
  }

  let subSql = [];
  if(crop_name){
    subSql.push(`crop_name = "${crop_name}"`)
  }
  if(crop_type_id){
    subSql.push(`crop_type_id = ${crop_type_id}`)
  }
  if(packed_date){
    subSql.push(`packed_date = "${packed_date}"`)
  }
  if(exp_date){
    subSql.push(`exp_date = "${exp_date}"`)
  }
  if(description){
    subSql.push(`description = "${description}"`)
  }

  if(subSql.length > 0){
    subSql = subSql.join(' , ');
    let sql1 = `update set ${subSql} from CROP where crop_id=${crop_id}`;
    let sql2 = `select * from CROP where crop_id=${crop_id}`;
    try{
      await simpleAsyncUpdateAndFetch(sql1, sql2, req, res, callbacks);
    } catch (err) {
      console.log('Error while nomal Updates\n', err);
    }
  }
  if(changeInQty){
    let connection = undefined;
    try {
      connection = await promisifiedGetConnection(connectionPool);
      await promisifiedBeginTransaction(connection);
      let {results : itemQtyPacket} = await promisifiedQuery(connection, sql3, []);
      if(itemQtyPacket.length < 1){
        // rollback
        // release
        // no item found
      }
      let presentQty = itemQtyPacket.qty;
      let newQty = presentQty + changeInQty;
      if(newQty < 0){
        // rollback
        // relesase
        // infeable
      }
      await promisifiedQuery(connection, sql4, []);
      let {results4} = promisifiedQuery(connection, sql5, []);
      await promisifiedCommit(connection);

    } catch(err) {
      
    }
  }
});

module.exports = router;
