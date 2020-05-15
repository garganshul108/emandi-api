const express = require("express");
const router = express.Router();

const authUser = require("../middleware/auth_user");
const authAdmin = require("../middleware/auth_admin");
const authVendor = require("../middleware/auth_vendor");
const decodeToken = require("../middleware/decode_token");

const simpleAsyncUpdateAndFetch = require("../db/requests/simple_async_update_and_fetch");
const simpleAsyncInsertAndFetch = require("../db/requests/simple_async_insert_and_fetch");
const simpleAsyncFetch = require("../db/requests/simple_async_fetch");
const simpleAsyncDelete = require("../db/requests/simple_async_delete");
const transactionProtectedQueries = require("../db/requests/transaction_protected_queries");

router.get("/me", [decodeToken], async (req, res) => {
  let sql;
  if (req.actor.user_id) {
    sql = `select * from ORDERS join ORDERED_ITEM using(order_id) where user_id=${user_id}`;
  } else if (req.actor.vendor_id) {
    sql = `select * from ORDERS join ORDERED_ITEM using(order_id) where vendor_id=${vendor_id}`;
  }
  return await simpleAsyncFetch(sql, req, res, {
    onSuccess: (req, res, results) => {
      res.status(200).send(results);
    },
  });
});

router.get("/:id", async (req, res) => {
  let order_id = req.params.id;
  let sql = `select * from ORDERS join ORDERED_ITEM using(order_id) where order_id=${order_id}`;
  return await simpleAsyncFetch(sql, req, res, {
    onSuccess: (req, res, results) => {
      res.status(200).send(results);
    },
  });
});

router.get("/", async (req, res) => {
  let sql = `select * from ORDER join ORDERED_ITEM using(order_id)`;
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
  let order_id = req.body.order_id;
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
  return await transactionProtectedQueries(sqls, req, res, {
    onSuccess: (req, res, results) => {
      res.status(201).send("ORDER CANCELLED");
    },
  });
});

router.post("/confirm", [decodeToken, authVendor], async (req, res) => {
  let order_id = req.body.order_id;
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
  return await transactionProtectedQueries(sqls, req, res, {
    onSuccess: (req, res, results) => {
      res.status(201).send("ORDER CONFIRMED");
    },
  });
});

router.post("/request", [decodeToken, authUser], async (req, res) => {
  let { delivery_address } = req.body.delivery_address;
  if (!delivery_address) {
    return res.status(400).send("No Delivery Address Provided");
  }
  let user_id = req.actor.user_id;
  let sqls = [
    {
      // get the vendor_id from the user cart
      getQueryStatement: (prevResults, prevFields) => {
        return `select DISTINCT(vendor_id) from CART join CROP using(crop_id) where user_id=${user_id}`;
      },
      onQueryResultUnsatisfied: (prevResults, prevFields) => {
        let statisfactionStatus = true;
        let action = undefined;
        if (prevResults["query_1"].length !== 1) {
          statisfactionStatus = false;
          action = (req, res, results) => {
            res
              .status(400)
              .send("No Item in the cart / too many vendors at same time");
          };
        }
        return { statisfactionStatus, action };
      },
    },
    {
      // generate Order
      getQueryStatement: (prevResults, prevFields) => {
        let vendor_id = prevResults["query_1"][0].vendor_id;
        let sql = `insert into ORDERS(user_id, vendor_id) values(${user_id}, ${vendor_id})`;
        return sql;
      },
    },
    {
      // get last order Order ID
      getQueryStatement: (prevResults, prevFields) => {
        return `select LAST_INSERT_ID() as order_id from ORDER`;
      },
    },
    {
      // get items from the Cart => insert into order item
      getQueryStatement: (prevResults, prevFields) => {
        let vendor_id = prevResults["query_1"][0].vendor_id;
        let order_id = prevResults["query_4"][0].order_id;
        return `insert into ORDERED_ITEM(order_id ,crop_id, item_qty, item_freezed_cost) select ${order_id}, crop_id, item_qty, (item_qty*crop_price) as item_freezed_cost from CART join CROP using(crop_id) where user_id=${user_id} and vendor_id=${vendor_id})`;
      },
    },
    {
      getQueryStatement: (prevResults, prevFields) => {
        return `delete from CART where user_id=${user_id}`;
      },
    },
    {
      getQueryStatement: (prevResults, prevFields) => {
        let order_id = prevResults["query_4"][0].order_id;
        return `select * from ORDERED_ITEM join ORDERS using(order_id) where order_id=${order_id}`;
      },
    },
  ];

  return await transactionProtectedQueries(sqls, req, res, {
    onSuccess: (req, res, results) => {
      res.status(201).send(results);
    },
  });
});

module.exports = router;
