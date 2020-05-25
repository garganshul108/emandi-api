const makeOrder = require("../order");

module.exports = makeConfirmOrder = ({ orderDb }) => {
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

    const confirmed = orderDb.confirm({ id });

    return {
      confirmedCount: 1,
      result: confirmed,
    };
  });
};
