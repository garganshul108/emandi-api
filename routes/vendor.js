const express = require("express");
const router = express.Router();
const connectionPool = require("../db/pool");

const vendor_crop = require("./vendor_crop");

const authAdmin = require("../middleware/auth_admin");
const authVendor = require("../middleware/auth_vendor");
const decodeToken = require("../middleware/decode_token");

const simpleGET = require("../db/requests/simple_get");
const simpleDELETE = require("../db/requests/simple_get");

const {
  promisifiedQuery,
  promisifiedGetConnection,
  promisifiedBeginTransaction,
  promisifiedRollback,
  promisifiedCommit,
} = require("../db/promisified_sql");

router.use("/crop", vendor_crop);

router.get("/me", [decodeToken, authVendor], (req, res) => {
  let vendor_id = req.actor.vendor_id;
  let sql = `select * from VENDOR where vendor_id=${vendor_id}`;
  return simpleGET(sql, req, res);
});

router.get("/:id", [decodeToken, authAdmin], (req, res) => {
  let vendor_id = req.params.id;
  let sql = `select * from VENDOR where vendor_id=${vendor_id}`;
  return simpleGET(sql, req, res);
});

router.get("/", (req, res) => {
  let sql = `select * from VENDOR;`;
  return simpleGET(sql, req, res);
});

router.patch("/", [decodeToken, authVendor], async (req, res) => {
  let {
    type,
    name,
    state_id,
    city_id,
    pin_code,
    address,
    profile_picture,
  } = req.body;
  if (
    !type &&
    !name &&
    !state_id &&
    !city_id &&
    !pin_code &&
    !address &&
    !profile_picture
  ) {
    return res.status(400).send("No argument is specified to be changed");
  }

  let vendor_id = req.actor.vendor_id;
  let subSql = [];
  if (type) {
    subSql.push(` type = "${type}" `);
  }
  if (name) {
    subSql.push(` name = "${name}" `);
  }
  if (state_id) {
    subSql.push(` state_id = ${state_id} `);
  }
  if (city_id) {
    subSql.push(` city_id = ${city_id} `);
  }
  if (pin_code) {
    subSql.push(` pin_code = ${pin_code} `);
  }
  if (address) {
    subSql.push(` address = "${address}" `);
  }
  if (profile_picture) {
    subSql.push(` profile_picture = "${profile_picture}" `);
  }
  subSql = subSql.join();
  let sql1 = `update VENDOR set ${subSql} where vendor_id=${vendor_id}`;
  let sql2 = `select * from VENDOR where vendor_id=${vendor_id}`;
  let connection = null;
  let errorOnSelectQuery = true;
  let errorOnUpdateQuery = true;
  try {
    connection = await promisifiedGetConnection(connectionPool);
    await promisifiedQuery(connection, sql1, []);
    errorOnUpdateQuery = false;
    const { results } = await promisifiedQuery(connection, sql2, []);
    errorOnSelectQuery = false;
    connection.release();
    return res.status(201).send(results);
  } catch (err) {
    if (!connection) {
      console.log("Error while getting connetion");
      console.log(err);
      return res.status(500).send("Internal Server Error");
    } else if (errorOnUpdateQuery) {
      console.log("Error while Updating Table");
      console.log(err);
      connection.release();
      return res.status(400).send(err.sqlMessage);
    } else if (errorOnSelectQuery) {
      console.log("Error while getting Vendor");
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

router.delete("/me", [decodeToken, authVendor], async (req, res) => {
  let vendor_id = req.actor.vendor_id;
  let sql1 = `DELETE from VENDOR where vendor_id=${vendor_id}`;
  let connection = null;
  let errorOnDelete = true;
  try {
    connection = await promisifiedGetConnection(connectionPool);
    await promisifiedQuery(connection, sql1, []);
    errorOnDelete = false;
    connection.release();
    return res.status(201).send("Account Deleted");
  } catch (err) {
    if (!connection) {
      console.log("Error on getting connection");
      console.log(err);
      return res.status(500).send("Internal Server Error");
    } else if (errorOnDelete) {
      console.log("Error on Delete");
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

// router.patch("/crop/:crop_id", [decodeToken.authVendor], async (req, res) => {
//   let vendor_id = req.actor.vendor_id;
//   let crop_id = req.params.crop_id;
//   let {
//     changeInQty,
//     crop_name,
//     crop_type_id,
//     packed_date,
//     exp_date,
//     description,
//   } = req.body;
//   if (!changeInQty || !crop_name || !crop_type_id ||packed_date||
//     exp_date||
//     description ) {
//     return res
//       .status(400)
//       .send(
//         'No change specified'
//       );
//   }
//   const simpleChanges = () => {

//   }

//   const specialChanges = () => {

//   }
//   let subSql = [];
//   if (!packed_date) {
//     packed_date = "NOW()";
//   } else {
//     packed_date = `"${packed_date}"`;
//   }
//   if (!exp_date) {
//     exp_date = "NULL";
//   }
//   if (!description) {
//     description = "NULL";
//   }

//   let sql1 = `insert into CROP(vendor_id, qty, crop_name, crop_type_id, packed_date, exp_date, description) values (${vendor_id},${qty},"${crop_name}",${crop_type_id},${packed_date},"${exp_date}","${description}")`;
//   let sql2 = `select * from CROP where crop_id=LAST_INSERT_ID()`;
//   let connection;
//   let errorOnBeginTransaction = true;
//   let errorOnCommit = true;
//   let errorOnFetchLastCrop = true;
//   let errorOnInsertCrop = true;
//   try {
//     connection = await promisifiedGetConnection(connectionPool);
//     await promisifiedBeginTransaction(connection);
//     errorOnBeginTransaction = false;
//     await promisifiedQuery(connection, sql1, []);
//     errorOnInsertCrop = false;
//     let { results: cropInserted } = await promisifiedQuery(
//       connection,
//       sql2,
//       []
//     );
//     errorOnFetchLastCrop = false;
//     await promisifiedCommit(connection);
//     errorOnCommit = false;
//     connection.release();
//     return res.status(201).send(cropInserted);
//   } catch (err) {
//     if (!connection) {
//       console.log("Error on getting connection");
//       console.log(err);
//       return res.status(500).send("Internal Server Error");
//     } else if (errorOnBeginTransaction) {
//       console.log("Error on begin transaction");
//       console.log(err);
//       connection.release();
//       return res.status(500).send("Internal Server Error");
//     } else if (errorOnInsertCrop) {
//       console.log("Error on inserting Crop");
//       console.log(err);
//       connection.release();
//       return res.status(400).send(err.message);
//     } else if (errorOnFetchLastCrop) {
//       console.log("Error on fetching Crop");
//       console.log(err);
//       connection.release();
//       return res.status(500).send("Internal Server Error");
//     } else if (errorOnCommit) {
//       console.log("Error on Commit");
//       console.log(err);
//       connection.release();
//       return res.status(500).send("Internal Server Error");
//     } else {
//       console.log("UNKNOWN ERROR");
//       console.log(err);
//       connection.release();
//       return res.status(500).send("Internal Server Error");
//     }
//   }
// });

// | POST | /vendor/crop | Adds a crop | | vendor_id (integer)<br/><br/> qty (decimal)<br/><br/> crop_name (string)<br/><br/> crop_type_id (integer from crop table)<br/><br/> packed_date (string 'YYYY-MM-DD HH:MM:SS') |
// | PATCH | /vendor/crop/:crop_id | Edit a specific crop |

// | GET | /vendor/crop | Shows all crops | limit (integer)<br/><br/> offset (integer) | | vendor_token|
// | GET | /vendor/crop/:crop_id | Shows a specific crop |
// | DELETE | /vendor/crop/:crop_id | Deletes crop with crop_id specified | |
// | DELETE | /vendor/crop/?id=1,2,3 | Deletes all crops with ids specified | id (comma seprated integers) |

module.exports = router;

//GET
//   return connectionPool.getConnection((err, connection) => {
//     if (err) {
//       console.log("Error while getting connection from the pool");
//       console.log(err);
//       return res.status(500).send("Internal Server Error");
//     }
//     connection.query(sql, (err, results, fields) => {
//       if (err) {
//         console.log("Error while fetching the data from DB");
//         console.log(err);
//         return res.status(400).send(err.message);
//       }
//       return res.status(200).send(results);
//     });
//   });
