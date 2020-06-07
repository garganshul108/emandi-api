const makeOrder = require("../../order");
module.exports = makePlaceOrder = ({ orderDb, listCrops, filterUndefined }) => {
  return (placeOrder = async ({
    user,
    vendor,
    orderedItems,
    delivery_address,
    ...extraInfo
  }) => {
    if (!Array.isArray(orderedItems) || orderedItems.length < 1) {
      throw new Error("Array of ordered items must be provided.");
    }

    for (let item of orderedItems) {
      if (!item.crop || !item.crop.id) {
        throw new Error("Crop id for the item must be provided.");
      }

      let c_id = item.crop.id;

      let crop = await listCrops({ id: c_id });
      if (!crop) {
        throw new Error("Invalid crop id provided.");
      }

      if (crop.vendor.id !== vendor.id) {
        throw new Error("Crop doesn't belong to the vendor provided.");
      }
      item.crop = crop;
    }

    const order = makeOrder({
      user,
      vendor,
      orderedItems,
      delivery_address,
      ...extraInfo,
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

    logOn.core("Place order with options: ", options);

    const requested = orderDb.request(options);

    return {
      requestedCount: 1,
      result: requested,
    };
  });
};
