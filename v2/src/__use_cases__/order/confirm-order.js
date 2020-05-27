const makeOrder = require("../../order");

module.exports = makeConfirmOrder = ({ orderDb, TXN, txnUpdateCropQty }) => {
  return (confirmOrder = async ({ id, vendor }) => {
    if (!id) {
      throw new Error("Order id must be provided.");
    }

    if (!vendor || !vendor.id) {
      throw new Error("Vendor id must be provided.");
    }

    const order = makeOrder({ id });
    const existing = orderDb.findById({ id: order.getId() });
    if (!existing) {
      return {
        cancelledCount: 0,
        message: "No order found with order id provided.",
      };
    }

    existing = existing[0];

    if (existing.order_status === "CONFIRMED") {
      return {
        confirmedCount: 0,
        message: "Order already confirmed.",
      };
    }

    if (existing.order_status === "CANCELLED") {
      return {
        confirmedCount: 0,
        message: "Order was cancelled already, could not be confirmed.",
      };
    }

    if (existing.order_status !== "PENDING") {
      return {
        confirmedCount: 0,
        message: "Only order in PENDING state can be confirmed.",
      };
    }

    try {
      const t = TXN.beginTransaction();
      for (let item of existing.orderedItems) {
        await txnUpdateCropQty(
          {
            id: crop_id,
            changeInQty: -1 * item_qty,
          },
          { _txn: t }
        );
      }
      await TXN.commitTransaction({ _txn: t });
      await orderDb.setStatusToConfirm({ id });
    } catch (e) {
      logOn.core(e);
      await TXN.rollbackTransaction({ _tex: t });
      throw new Error("Order could not be confirmed. Try again.");
    }

    const confirmed = orderDb.findById({ id });

    return {
      confirmedCount: 1,
      result: confirmed,
    };
  });
};
