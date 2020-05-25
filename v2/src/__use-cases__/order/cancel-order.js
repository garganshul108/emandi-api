const makeOrder = require("../order");

module.exports = makeCancelOrder = ({ orderDb, TXN, txnUpdateCropQty }) => {
  return (cancelOrder = async ({ id, vendor, user }) => {
    if (!id) {
      throw new Error("Order id must be provided.");
    }

    if (!user || !user.id || !vendor || !vendor.id) {
      throw new Error("At least one actor for cancel action must be provided");
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

    if (existing.order_status === "CANCELLED") {
      return {
        cancelledCount: 0,
        message: "Order already cancelled.",
      };
    }

    const orderToBeCancelled = makeOrder({ ...existing });
    if (orderToBeCancelled.getOrderStatus() === "CONFIRMED") {
      try {
        const t = TXN.beginTransaction();
        for (let item of existing.orderToBeCancelled) {
          const exitsingCrop = 
          sads;
          await txnUpdateCropQty({
            id: crop_id,
            changeInQty: item_qty,
            _txn: t,
          });
        }
        await TXN.commitTransaction({ _txn: t });
        await orderDb.setStatusToCancel({ id });
      } catch (e) {
        logOn.core(e);
        await TXN.rollbackTransaction({ _tex: t });
        throw new Error("Order could not be confirmed. Try again.");
      }
    } else {
      await orderDb.({ id });
    }
    orderToBeCancelled.makeCancelOrder();

    return {
      cancelledCount: 1,
      message: "Order was cancelled successfully.",
    };
  });
};
