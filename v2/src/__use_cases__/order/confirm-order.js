const makeOrder = require("../../order");

module.exports = makeConfirmOrder = ({ orderDb, TXN, updateCrop }) => {
  return (confirmOrder = async ({ id, vendor }) => {
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

    if (order.getOrderStatus() === "CONFIRMED") {
      return {
        confirmedCount: 0,
        message: "Order already confirmed.",
      };
    }

    if (order.getOrderStatus === "CANCELLED") {
      return {
        confirmedCount: 0,
        message: "Order was cancelled already, could not be confirmed.",
      };
    }

    if (order.getOrderStatus() === "IN QUEUE") {
      return {
        confirmedCount: 0,
        message:
          "Order is in queue. Further actions only allowed after processing",
      };
    }

    if (order.getOrderStatus() !== "PENDING") {
      return {
        confirmedCount: 0,
        message: "Only order in PENDING state can be confirmed.",
      };
    }

    try {
      const t = await TXN.getTransactionKey();
      await order.confirm({ t });
      await TXN.commitTransaction({ t });
      await orderDb.setStatusToConfirm({ id });
    } catch (e) {
      logOn.core(e);
      await TXN.rollbackTransaction({ t });
      throw new Error(`Order could not be confirmed. ${e.message}`);
    }

    const confirmed = orderDb.findById({ id });

    return {
      confirmedCount: 1,
      result: confirmed,
    };
  });
};
