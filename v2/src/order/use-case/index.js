const makeCancelOrder = require("./cancel-order");
const makeConfirmOrder = require("./confirm-order");
const makeListOrders = require("./list-orders");
const makePlaceOrder = require("./place-order");

const orderDb = require("../data-access");
const filterUndefined = require("../../../util/filter-undefined");

const cancelOrder = makeCancelOrder({ orderDb });
const confirmOrder = makeConfirmOrder({ orderDb });
const placeOrder = makePlaceOrder({ listCrops, orderDb });
const listOrders = makeListOrders({ orderDb, filterUndefined });

module.exports = {
  cancelOrder,
  confirmOrder,
  placeOrder,
  listOrders,
};
