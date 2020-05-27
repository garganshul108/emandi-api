const express = require("express");
const router = express.Router();

const Joi = require("@hapi/joi");
const { joiValidator, defaultSchema } = require("../util/joi_validator");

const simpleAsyncFetch = require("../db/requests/simple_async_fetch");

let attributes = [
  "crop_id",
  "crop_qty",
  "crop_name",
  "crop_type_id",
  "description",
  "state_id",
  "city_id",
  "crop_class",
  "crop_type_name",
  "vendor_id",
  "crop_image",
  "crop_price",
];

attributes = attributes.join(" , ");

router.get("/:id?", async (req, res) => {
  // let { city_id, state_id, crop_class, crop_type_id, vendor_id } = req.query;
  // let { id } = req.params;

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

  if (!validationStatus) {
    return res
      .status(400)
      .send([{ message: `Invalid Request Format ${optionals.errorList}` }]);
  }

  let { city_id, state_id, crop_class, crop_type_id, vendor_id } = value;
  let { id } = value;

  let locFlag = false;
  let typeFlag = false;
  let extraQueries = false;
  let subSql = [];
  if (city_id) {
    locFlag = true;
    extraQueries = true;
    subSql.push(`city_id=${city_id}`);
  }
  if (state_id) {
    locFlag = true;
    extraQueries = true;
    subSql.push(`state_id=${state_id}`);
  }
  if (crop_class) {
    typeFlag = true;
    extraQueries = true;
    subSql.push(`crop_class="${crop_class}"`);
  }
  if (crop_type_id) {
    typeFlag = true;
    extraQueries = true;
    subSql.push(`crop_type_id="${crop_type_id}"`);
  }
  if (vendor_id) {
    extraQueries = true;
    subSql.push(`vendor_id="${vendor_id}"`);
  }
  if (id) {
    extraQueries = true;
    subSql.push(`crop_id=${id}`);
  }

  subSql = subSql.join(" and ");

  let sql = `select ${attributes} from CROP`;
  sql = `${sql} join VENDOR using(vendor_id)`;
  sql = `${sql} join CROP_TYPE using(crop_type_id)`;
  sql = `${sql} left join CROP_IMAGE using(crop_id)`;

  if (extraQueries) sql = `${sql} where ${subSql}`;

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
