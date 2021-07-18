const makeCancelOrder = require("./cancel-order");
const makeConfirmOrder = require("./confirm-order");
const makeListOrders = require("./list-orders");
const makeRequestOrder = require("./request-order");

const orderDb = require("../data-access");
const filterUndefined = require("../../../helper/util/filter-undefined");


const cancelOrder = makeCancelOrder({ orderDb });
const confirmOrder = makeConfirmOrder({ orderDb });
const requestOrder = makeRequestOrder({ listCrops, orderDb });
const listOrders = makeListOrders({ orderDb, filterUndefined });

module.exports = {
  cancelOrder,
  confirmOrder,
  requestOrder,
  listOrders,
};
