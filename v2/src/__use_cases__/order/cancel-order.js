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

    const cancelled = orderDb.cancelById({ id });

    return {
      cancelledCount: 1,
      result: cancelled,
    };
  });
};
