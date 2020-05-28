const makeOrder = require("../../order");

module.exports = makeCancelOrder = ({ orderDb, TXN }) => {
  return (cancelOrder = async ({ id, vendor }) => {
    if (!id) {
      throw new Error("Order id must be provided.");
    }

    if (!vendor || !vendor.id) {
      throw new Error("Vendor id must be provided.");
    }

    const existing = orderDb.findById({ id });

    if (!existing) {
      return {
        cancelledCount: 0,
        message: "No order found with order id provided.",
      };
    }

    const order = makeOrder(...existing);

    if (order.getOrderStatus() === "CANCELLED") {
      return {
        cancelledCount: 0,
        message: "Order already cancelled.",
      };
    }

    if (order.getOrderStatus() === "IN QUEUE") {
      return {
        cancelledCount: 0,
        message:
          "Order is in queue. Further actions only allowed after processing",
      };
    }

    try {
      const t = await TXN.getTransactionKey();
      await order.cancel({ t });
      await TXN.commitTransaction({ t });
      await orderDb.setStatusToCancel({ id });
    } catch (e) {
      logOn.core(e);
      await TXN.rollbackTransaction({ t });
      throw new Error(`Order could not be cancelled. ${e.message}`);
    }

    const cancelled = orderDb.findById({ id });

    return {
      cancelledCount: 1,
      result: cancelled,
    };
  });
};
