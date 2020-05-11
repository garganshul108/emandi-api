const express = require("express");
const router = express.Router();

const authUser = require("../middleware/auth_user");
const decodeToken = require("../middleware/decode_token");

const simpleAsyncUpdateAndFetch = require("../db/requests/simple_async_update_and_fetch");
const simpleAsyncInsertAndFetch = require("../db/requests/simple_async_insert_and_fetch");
const simpleAsyncFetch = require("../db/requests/simple_async_fetch");
const simpleAsyncDelete = require("../db/requests/simple_async_delete");

router.get("/:item_id", [decodeToken, authUser], async (req, res) => {
  let item_id = req.params.item_id;
  let user_id = req.actor.user_id;
  let sql = `select * from CART where item_id=${item_id} and user_id=${user_id}`;
  const callbacks = {
      onSuccess:(req, res, results)=>{
        res.status(200).send(results);
      }
  };
  return await simpleAsyncFetch(sql, req, res, callbacks);
});

router.get("/", [decodeToken, authUser], async (req, res) => {
    let user_id = req.actor.user_id;
    let sql = `select * from CART where user_id=${user_id}`;
    const callbacks = {
        onSuccess:(req, res, results)=>{
          res.status(200).send(results);
        }
    };
    return await simpleAsyncFetch(sql, req, res, callbacks);
  });


router.delete("/:item_id", [decodeToken, authUser], async (req, res) => {
  let item_id = req.param.item_id;
  let user_id = req.actor.user_id;
  let sql = `delete from CART where item_id=${item_id} and user_id=${user_id}`;
  const callbacks = {
      onSuccess:(req, res, results) => {
        return res.status(200).send("Item Deleted Successfully");
      }
    };
    return await simpleAsyncDelete(sql, req, res, callbacks);

});

router.delete("/", [decodeToken, authUser], async (req, res) => {
  let item_ids = req.query.id;
  let user_id = req.actor.user_id;
  let sql = `delete from CART where item_id IN (${item_ids}) and user_id=${user_id}`;
  const callbacks = {
    onSuccess:(req, res, results) => {
      return res.status(200).send("Item Deleted Successfully");
    }
  };
  return await simpleAsyncDelete(sql, req, res, callbacks);
});



router.post("/", [decodeToken, authUser], async (req, res) => {
  let user_id = req.actor.user_id;
  let {
	  crop_id ,
	  item_qty
  } = req.body;
  if (!item_qty || crop_id) {
    return res
      .status(400)
      .send(
        '"item_qty" and "crop_id" all or any one not specified'
      );
  }

  let sql1 = `insert into CART(user_id, item_qty, crop_id) values (${user_id},${item_qty},${crop_id})`;
  let sql2 = `select item_id, user_id, item_qty, crop_id, crop_price, (CROP.crop_price*CART.item_qty) as item_cost from CART join CROP using(crop_id) where item_id=LAST_INSERT_ID()`;
  const callbacks= {
    onSuccess:(req, res, results)=>{
      res.status(201).send(results);
    }
  };

  return await simpleAsyncInsertAndFetch(sql1, sql2, req, res, callbacks);
});


router.patch("/:item_id",[decodeToken, authUser], (req, res) => {
  let {item_id} = req.params;
  let user_id = req.actor.user_id;
  let {
    changeInQty,
  } = req.body

  if(!changeInQty){
    return res.status(400).send("No attributes specified to be changed");
  }

  let subSql = [];
  if(changeInQty){
    subSql.push(`qty = qty + (${changeInQty})`);
  }

  if(subSql.length > 0){
    subSql = subSql.join(' , ');
    let sql1 = `update set ${subSql} from CART where item_id=${item_id} and user_id=${user_id}`;
    let sql2 = `select item_id, user_id, item_qty, crop_id, crop_price, (CROP.crop_price*CART.item_qty) as item_cost from CART join CROP using(crop_id) where item_id=${item_id}`;
    const callbacks = {
      onSuccess:(req, res, results) => {
        res.status(201).send(results);
      }
    };
    try{
      await simpleAsyncUpdateAndFetch(sql1, sql2, req, res, callbacks);
    } catch (err) {
      console.log('Error while nomal Updates\n', err);
    }
  }
});

module.exports = router;
