const express = require("express");
const router = express.Router();

const authUser = require("../middleware/auth_user");
const decodeToken = require("../middleware/decode_token");

const Joi = require("@hapi/joi");
const { joiValidator, defaultSchema } = require("../util/joi_validator");

const simpleAsyncUpdateAndFetch = require("../db/requests/simple_async_update_and_fetch");
const simpleAsyncInsertAndFetch = require("../db/requests/simple_async_insert_and_fetch");
const simpleAsyncFetch = require("../db/requests/simple_async_fetch");
const simpleAsyncDelete = require("../db/requests/simple_async_delete");

let attributes = ["item_id", "user_id", "crop_id", "item_qty"];

attributes = attributes.join(" , ");

router.get("/:item_id", [decodeToken, authUser], async (req, res) => {
  let item_id = req.params.item_id;
  let user_id = req.actor.user_id;

  const { status: valid, optionals } = joiValidator([
    {
      schema: { ...defaultSchema },
      object: { ...req.params, ...req.actor },
    },
    {
      schema: {
        item_id: Joi.required(),
        user_id: Joi.required(),
      },
      object: { ...req.params, ...req.actor },
    },
  ]);

  if (!valid) {
    return res
      .status(400)
      .send([{ message: `Invalid Request ${optionals.errorList}` }]);
  }

  let sql = `select *, (crop_price*item_qty) as item_price from CART join CROP using(crop_id) join CROP_TYPE using(crop_type_id) where item_id=${item_id} and user_id=${user_id}`;
  const callbacks = {
    onSuccess: (req, res, results) => {
      res.status(200).send(results);
    },
  };
  return await simpleAsyncFetch(sql, req, res, callbacks);
});

router.get("/", [decodeToken, authUser], async (req, res) => {
  let user_id = req.actor.user_id;

  const { status: valid, optionals } = joiValidator([
    {
      schema: { ...defaultSchema },
      object: { ...req.actor },
    },
    {
      schema: {
        user_id: Joi.required(),
      },
      object: { ...req.actor },
    },
  ]);

  if (!valid) {
    return res
      .status(400)
      .send([{ message: `Invalid Request ${optionals.errorList}` }]);
  }

  let sql = `select *, (crop_price*item_qty) as item_price from CART join CROP using(crop_id) join CROP_TYPE using(crop_type_id) where user_id=${user_id}`;
  // let sql = `select * from CART where user_id=${user_id}`;
  const callbacks = {
    onSuccess: (req, res, results) => {
      res.status(200).send(results);
    },
  };
  return await simpleAsyncFetch(sql, req, res, callbacks);
});

router.delete("/:item_id", [decodeToken, authUser], async (req, res) => {
  let item_id = req.param.item_id;
  let user_id = req.actor.user_id;
  const { status: valid, optionals } = joiValidator([
    {
      schema: { ...defaultSchema },
      object: { ...req.params, ...req.actor },
    },
    {
      schema: {
        item_id: Joi.required(),
        user_id: Joi.required(),
      },
      object: { ...req.params, ...req.actor },
    },
  ]);

  if (!valid) {
    return res
      .status(400)
      .send([{ message: `Invalid Request ${optionals.errorList}` }]);
  }
  let sql = `delete from CART where item_id=${item_id} and user_id=${user_id}`;
  const callbacks = {
    onSuccess: (req, res, results) => {
      return res.status(200).send([{ message: "Item Deleted Successfully" }]);
    },
  };
  return await simpleAsyncDelete(sql, req, res, callbacks);
});

router.delete("/", [decodeToken, authUser], async (req, res) => {
  let item_ids = req.query.id;
  let user_id = req.actor.user_id;
  const { status: valid, optionals } = joiValidator([
    {
      schema: { ...defaultSchema },
      object: { ...req.actor },
    },
    {
      schema: {
        item_ids: Joi.string().required(),
        user_id: Joi.required(),
      },
      object: { ...req.query, ...req.actor },
    },
  ]);

  if (!valid) {
    return res
      .status(400)
      .send([{ message: `Invalid Request ${optionals.errorList}` }]);
  }

  let sql = `delete from CART where item_id IN (${item_ids}) and user_id=${user_id}`;
  const callbacks = {
    onSuccess: (req, res, results) => {
      return res.status(200).send([{ message: "Item Deleted Successfully" }]);
    },
  };
  return await simpleAsyncDelete(sql, req, res, callbacks);
});

router.post("/", [decodeToken, authUser], async (req, res) => {
  let user_id = req.actor.user_id;
  let { crop_id, item_qty } = req.body;

  const { status: valid, optionals } = joiValidator([
    {
      schema: { ...defaultSchema },
      object: { ...req.body, ...req.actor },
    },
    {
      schema: {
        crop_id: Joi.required(),
        item_qty: Joi.required(),
        user_id: Joi.required(),
      },
      object: { ...req.body, ...req.actor },
    },
  ]);

  if (!valid) {
    return res
      .status(400)
      .send([{ message: `Invalid Request ${optionals.errorList}` }]);
  }

  // if (!item_qty || !crop_id) {
  //   return res
  //     .status(400)
  //     .send([
  //       { message: '"item_qty" and "crop_id" all or any one not specified' },
  //     ]);
  // }

  let sql1 = `insert into CART(user_id, item_qty, crop_id) values (${user_id},${item_qty},${crop_id})`;
  let sql2 = `select item_id, user_id, item_qty, crop_id, crop_price, (CROP.crop_price*CART.item_qty) as item_cost from CART join CROP using(crop_id) where item_id=LAST_INSERT_ID()`;
  const callbacks = {
    onSuccess: (req, res, results) => {
      res.status(201).send(results);
    },
  };

  return await simpleAsyncInsertAndFetch(sql1, sql2, req, res, callbacks);
});

router.patch("/:item_id", [decodeToken, authUser], async (req, res) => {
  let { item_id } = req.params;
  let user_id = req.actor.user_id;

  let { changeInQty } = req.body;

  const { status: valid, optionals } = joiValidator([
    {
      schema: { ...defaultSchema },
      object: { ...req.params, ...req.actor },
    },
    {
      schema: {
        item_id: Joi.required(),
        user_id: Joi.required(),
        changeInQty: Joi.number().required(),
      },
      object: { ...req.params, ...req.actor, ...req.body },
    },
  ]);

  if (!valid) {
    return res
      .status(400)
      .send([{ message: `Invalid Request ${optionals.errorList}` }]);
  }

  let subSql = [];
  if (changeInQty) {
    subSql.push(`qty = qty + (${changeInQty})`);
  }

  if (subSql.length > 0) {
    subSql = subSql.join(" , ");
    let sql1 = `update set ${subSql} from CART where item_id=${item_id} and user_id=${user_id}`;
    let sql2 = `select *, (crop_price*item_qty) as item_price from CART join CROP using(crop_id) join CROP_TYPE using(crop_type_id) where item_id=${item_id}`;
    const callbacks = {
      onSuccess: (req, res, results) => {
        res.status(201).send(results);
      },
    };
    try {
      await simpleAsyncUpdateAndFetch(sql1, sql2, req, res, callbacks);
    } catch (err) {
      console.log("Error while nomal Updates\n", err);
    }
  }
});

module.exports = router;
