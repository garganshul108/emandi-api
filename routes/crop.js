const express = require("express");
const router = express.Router();

const simpleAsyncFetch = require("../db/requests/simple_async_fetch");

let attributes = [
  "crop_id",
  "qty",
  "crop_name",
  "crop_type_id",
  "packed_date",
  "exp_date",
  "description",
  "state_id",
  "city_id",
  "crop_class",
  "crop_type_name",
  "vendor_id",
];

attributes = attributes.join(",");

router.get("/:id", async (req, res) => {
  let { id } = req.params;

  let sql = `select ${attributes} from CROP`;
  sql = `${sql} join VENDOR using(vendor_id)`;
  sql = `${sql} join CROP_TYPE using(crop_type_id)`;
  sql = `${sql} where crop_id=${id}`;

  const callbacks = {
    onSuccess: (req, res, results) => {
      return res.status(200).send(results);
    },
  };
  try {
    return await simpleAsyncFetch(sql, req, res, callbacks);
  } catch (err) {
    console.log(err);
  }
});

router.get("/", async (req, res) => {
  let { city_id, state_id, crop_class, crop_type_id, vendor_id } = req.query;

  let locFlag = false;
  let typeFlag = false;
  let subSql = [];
  if (city_id) {
    locFlag = true;
    subSql.push(`city_id=${city_id}`);
  }
  if (state_id) {
    locFlag = true;
    subSql.push(`state_id=${state_id}`);
  }
  if (crop_class) {
    typeFlag = true;
    subSql.push(`crop_class="${crop_class}"`);
  }
  if (crop_type_id) {
    typeFlag = true;
    subSql.push(`crop_type_id="${crop_type_id}"`);
  }
  if (vendor_id) {
    subSql.push(`crop_type_id="${vendor_id}"`);
  }

  subSql = subSql.join(" and ");

  let sql = `select ${attributes} from CROP`;
  sql = `${sql} join VENDOR using(vendor_id)`;
  sql = `${sql} join CROP_TYPE using(crop_type_id)`;

  sql = `${sql} where ${subSql}`;

  const callbacks = {
    onSuccess: (req, res, results) => {
      return res.status(200).send(results);
    },
  };
  try {
    return await simpleAsyncFetch(sql, req, res, callbacks);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
