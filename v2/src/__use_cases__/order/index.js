const makeCancelOrder = require("./cancel-order");
const makeConfirmOrder = require("./confirm-order");
const makeListOrders = require("./list-orders");
const makeRequestOrder = require("./request-order");

const orderDb = require("../data-access");
const filterUndefined = require("../../../helper/util/filter-undefined");

const { ORM } = require("../../../db");
const TXN = {
  beginTransaction: () => {
    return ORM.beginTransaction();
  },
  commitTransaction: ({ t }) => {
    return ORM.commit({ transaction: t });
  },
  rollbackTransaction: ({ t }) => {
    return ORM.rollback({ transaction: t });
  },
};

const cancelOrder = makeCancelOrder({ orderDb, TXN });
const confirmOrder = makeConfirmOrder({ orderDb, TXN });
const requestOrder = makeRequestOrder({ listCrops, orderDb });
const listOrders = makeListOrders({ orderDb, filterUndefined });

module.exports = {
  cancelOrder,
  confirmOrder,
  requestOrder,
  listOrders,
};
