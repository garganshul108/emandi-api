const express = require("express");
const router = express.Router();

const authUser = require("../middleware/auth_user");
const authAdmin = require("../middleware/auth_admin");
const authVendor = require("../middleware/auth_vendor");
const decodeToken = require("../middleware/decode_token");

const Joi = require("@hapi/joi");
const { joiValidator, defaultSchema } = require("../util/joi_validator");

const simpleAsyncUpdateAndFetch = require("../db/requests/simple_async_update_and_fetch");
const simpleAsyncInsertAndFetch = require("../db/requests/simple_async_insert_and_fetch");
const simpleAsyncFetch = require("../db/requests/simple_async_fetch");
const simpleAsyncDelete = require("../db/requests/simple_async_delete");
const transactionProtectedAsyncQueries = require("../db/requests/transaction_protected_async_queries");

let attr = [
  "order_id",
  "CROP.vendor_id",
  "user_id",
  "crop_id",
  "crop_price",
  "crop_name",
  "crop_image",
  "crop_type_image",
  "item_qty",
  "item_freezed_cost",
  "issue_timestamp",
  "delivery_address",
  "order_status",
];

attr = attr.join(" , ");

router.get("/me", [decodeToken], async (req, res) => {
  let sql;
  if (req.actor.user_id) {
    sql = `select * from ORDERS where user_id=${req.actor.user_id}`;
  } else if (req.actor.vendor_id) {
    sql = `select * from ORDERS where vendor_id=${req.actor.vendor_id}`;
  }
  return await simpleAsyncFetch(sql, req, res, {
    onSuccess: (req, res, results) => {
      res.status(200).send(results);
    },
  });
});

router.get("/:id", async (req, res) => {
  // let order_id = req.params.id;
  const { status: valid, optionals, value } = joiValidator([
    {
      schema: { id: Joi.number().min(1) },
      object: { ...req.params },
    },
  ]);

  if (!valid) {
    return res
      .status(400)
      .send([{ message: `Invalid Request Format ${optionals.errorList}` }]);
  }

  let order_id = value.id;

  let sql = `select ${attr} from ORDERED_ITEM join ORDERS using(order_id) join CROP using(crop_id) join CROP_TYPE using(crop_type_id) left join CROP_IMAGE using(crop_id) where order_id=${order_id}`;
  return await simpleAsyncFetch(sql, req, res, {
    onSuccess: (req, res, results) => {
      res.status(200).send(results);
    },
  });
});

router.get("/", async (req, res) => {
  let sql = `select * from ORDERS join ORDERED_ITEM using(order_id)`;
  return await simpleAsyncFetch(sql, req, res, {
    onSuccess: (req, res, results) => {
      res.status(200).send(results);
    },
  });
});

// POST
/**
 * posted by user only, decodeToken authUser
 * /confirm change of status pending => confirm, via vendor only, decodeToken authVendor
 * /cancel change of status cancel => by any
 */

//order cannot be deleted or edited once posted

router.post("/cancel", [decodeToken], async (req, res) => {
  // let order_id = req.body.order_id;

  const { status: valid, optionals, value } = joiValidator([
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

  let order_id = value.order_id;

  let sqls = [
    {
      getQueryStatement: (prevResults, prevFields) => {
        return `select crop_id, item_qty from ORDERED_ITEM where order_id = ${order_id}`;
      },
    },
    {
      getQueryStatement: (prevResults, prevFields) => {
        let items = prevResults["query_1"];
        let sql = `update CROP set crop_qty = case`;
        let ids = [];
        for (let item of items) {
          sql = `${sql} when crop_id = ${item.crop_id} then (crop_qty + ${item.item_qty})`;
          ids.push(item.crop_id);
        }
        ids = ids.join(",");
        sql = `${sql} where crop_id in (${ids})`;
        return sql;
      },
    },
    {
      getQueryStatement: (prevResults, prevFields) => {
        let sql = `update ORDERS set order_status="CANCELLED" where order_id=${order_id}`;
        return sql;
      },
    },
  ];
  return await transactionProtectedAsyncQueries(sqls, req, res, {
    onSuccess: (req, res, results) => {
      res.status(201).send([{ message: "ORDER CANCELLED" }]);
    },
  });
});

router.post("/confirm", [decodeToken, authVendor], async (req, res) => {
  // let order_id = req.body.order_id;

  const { status: valid, optionals, value } = joiValidator([
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

  let order_id = value.order_id;

  let sqls = [
    {
      getQueryStatement: (prevResults, prevFields) => {
        return `select crop_id, item_qty from ORDERED_ITEM where order_id = ${order_id}`;
      },
    },
    {
      getQueryStatement: (prevResults, prevFields) => {
        let items = prevResults["query_1"];
        let sql = `update CROP set crop_qty = case`;
        let ids = [];
        for (let item of items) {
          sql = `${sql} when crop_id = ${item.crop_id} then (crop_qty - ${item.item_qty})`;
          ids.push(item.crop_id);
        }
        ids = ids.join(",");
        sql = `${sql} end where crop_id in (${ids})`;
        return sql;
      },
    },
    {
      getQueryStatement: (prevResults, prevFields) => {
        let sql = `update ORDERS set order_status="CONFIRMED" where order_id=${order_id}`;
        return sql;
      },
    },
  ];
  return await transactionProtectedAsyncQueries(sqls, req, res, {
    onSuccess: (req, res, results) => {
      res.status(201).send([{ message: "ORDER CONFIRMED" }]);
    },
  });
});

router.post("/request", [decodeToken, authUser], async (req, res) => {
  let delivery_address = req.body.delivery_address;
  let order = req.body.order;

  const { status: valid, optionals, value } = joiValidator([
    {
      schema: { ...defaultSchema },
      object: { ...req.body },
    },
    {
      schema: {
        delivery_address: Joi.required(),
        order: Joi.array()
          .items(
            Joi.object({
              item_qty: Joi.number().required(),
              crop_id: Joi.number().min(1).required(),
            })
          )
          .min(1),
      },
      object: { ...req.body },
    },
  ]);

  if (!valid) {
    return res
      .status(400)
      .send([{ message: `Invalid Request Format ${optionals.errorList}` }]);
  }

  // if (!delivery_address || !order) {
  //   return res
  //     .status(400)
  //     .send([{ message: '"delivery_address" or "order" not provided' }]);
  // }
  // if (order.length == 0) {
  //   return res
  //     .status(400)
  //     .send([{ message: "No items specified for ordering" }]);
  // }
  let user_id = req.actor.user_id;
  let crop_ids = [];
  for (let item of order) {
    if (!item.crop_id)
      return res
        .status(400)
        .send([{ message: '"crop_id" not specified for an item' }]);
    crop_ids.push(item.crop_id);
  }
  crop_ids = crop_ids.join(" , ");
  let sqls = [
    {
      // get the vendor_id from the user cart
      getQueryStatement: (prevResults, prevFields) => {
        return `select DISTINCT(vendor_id) as vendor_id from CROP where crop_id in (${crop_ids})`;
      },
      checkQueryResultSatisfaction: (prevResults, prevFields) => {
        console.log("ORDER statisfaction Ran");
        let statisfactionStatus = true;
        let action = undefined;
        console.log(prevResults["query_1"]);
        if (prevResults["query_1"].length !== 1) {
          statisfactionStatus = false;
          action = (req, res, results) => {
            res.status(400).send([
              {
                message: "No Item in the cart / too many vendors at same time",
              },
            ]);
          };
        }
        return { statisfactionStatus, action };
      },
    },
    {
      // generate Order
      getQueryStatement: (prevResults, prevFields) => {
        let vendor_id = prevResults["query_1"][0].vendor_id;
        let sql = `insert into ORDERS(user_id, vendor_id, delivery_address) values(${user_id}, ${vendor_id}, "${delivery_address}")`;
        return sql;
      },
    },
    {
      // get last order Order ID
      getQueryStatement: (prevResults, prevFields) => {
        return `select LAST_INSERT_ID() as order_id from ORDERS`;
      },
    },
    {
      // get items from the Cart => insert into order item
      getQueryStatement: (prevResults, prevFields) => {
        let vendor_id = prevResults["query_1"][0].vendor_id;
        let order_id = prevResults["query_3"][0].order_id;
        // console.log("PREV RESULTS");
        // console.log(prevResults);
        let item_qty_field = [];
        for (let item of order) {
          item_qty_field.push(
            `when crop_id=${item.crop_id} then ${item.item_qty}`
          );
        }
        item_qty_field = item_qty_field.join(" ");
        item_qty_field = `(case ${item_qty_field} end)`;
        let sql = `insert into ORDERED_ITEM(order_id ,crop_id, item_qty, item_freezed_cost)`;
        sql = `${sql} select ${order_id}, crop_id, ${item_qty_field} as item_qty, (${item_qty_field}*crop_price) as item_freezed_cost from CROP where crop_id in (${crop_ids}) and vendor_id=${vendor_id}`;
        return sql;
      },
    },
    {
      getQueryStatement: (prevResults, prevFields) => {
        let order_id = prevResults["query_3"][0].order_id;
        return `select ${attr} from ORDERED_ITEM join CROP using(crop_id) join CROP_TYPE using(crop_type_id) left join CROP_IMAGE using(crop_id) join ORDERS using(order_id) where order_id=${order_id}`;
      },
    },
  ];

  return await transactionProtectedAsyncQueries(sqls, req, res, {
    onSuccess: (req, res, results) => {
      const finalResults = results["query_5"];
      res.status(201).send(finalResults);
    },
  });
});

module.exports = router;
