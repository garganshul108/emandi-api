const makeOrder = require("../../order");
const orderedItem = require("../../order/ordered-item");

module.exports = makeConfirmOrder = ({ orderDb, TXN, updateCrop }) => {
  return (confirmOrder = async ({ id, vendorId }) => {
    if (!id) {
      throw new Error("Order id must be provided.");
    }

    if (!vendorId) {
      throw new Error("Vendor id must be provided.");
    }

    const existing = orderDb.findById({ id });

    if (!existing && existing.vendorId !== vendorId) {
      return {
        cancelledCount: 0,
        message: "No order found with order id and vendor id pair provided.",
      };
    }

    for (let item of existing.orderedItems) {
      if (!item.cropId) {
        throw new Error("Crop id for the item must be provided.");
      }

      let cId = item.cropId;

      let crop = await listCrops({ id: cId });
      if (!crop) {
        throw new Error("Invalid crop id provided.");
      }

      if (crop.vendor.id !== vendorId) {
        throw new Error("Crop doesn't belong to the vendor provided.");
      }
      item.crop = crop;
    }

    if (order.getOrderStatus() === "CONFIRMED") {
      return {
        confirmedCount: 0,
        message: "Order already confirmed.",
      };
    }

    const order = makeOrder(...existing);

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

    let canBeConfirmed = true;
    for (let item of order.getOrderedItems()) {
      if (item.crop.qty < item.itemQty) {
        canBeConfirmed = false;
      }
    }

    if (!canBeConfirmed) {
      return {
        confirmedCount: 0,
        message: "Cannot be processed due to insufficient supplies.",
      };
    }

    for (let item of order.getOrderedItems()) {
      item.crop.addQty(-1 * item.itemQty);
    }

    const confirmed = orderDb.confirmById({ id });

    return {
      confirmedCount: 1,
      result: confirmed,
    };
  });
};
