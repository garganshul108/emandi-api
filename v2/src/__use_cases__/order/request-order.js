const makeOrder = require("../../order");
module.exports = makePlaceOrder = ({ orderDb, listCrops, filterUndefined }) => {
  return (placeOrder = async ({
    userId,
    vendorId,
    orderedItems,
    delivery_address,
    ...extraInfo
  }) => {
    if (!Array.isArray(orderedItems) || orderedItems.length < 1) {
      throw new Error("Array of ordered items must be provided.");
    }

    for (let item of orderedItems) {
      if (!item.cropId) {
        throw new Error("Crop id for the item must be provided.");
      }

      let cId = item.cropId;

      let crop = await listCrops({ id: cId });
      if (!crop) {
        throw new Error("No crop found with the provided id.");
      }

      if (crop.vendor.id !== vendorId) {
        throw new Error("Crop doesn't belong to the vendor provided.");
      }

      item.crop = crop;
    }

    const order = makeOrder({
      userId,
      vendorId,
      orderedItems,
      deliveryAddress,
      ...extrainfo,
    });

    const options = filterUndefined({
      user_id: order.getUser().getId(),
      vendor_id: order.getVendor().getId(),
      delivery_address: order.getDeliveryAddress(),
      orderedItems: order.getOrderedItems(),
      order_status: order.getOrderStatus().getStatus(),
      issue_timestamp: order.getIssueTimestamp(),
      checkout_value: order.getCheckoutValue(),
    });

    const requested = orderDb.request(options);

    return {
      requestedCount: 1,
      result: requested,
    };
  });
};
