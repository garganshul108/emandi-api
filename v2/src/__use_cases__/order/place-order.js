const makeOrder = require("../../order");
module.exports = makePlaceOrder = ({ orderDb, listCrops, filterUndefined }) => {
  return (placeOrder = async ({
    user,
    vendor,
    orderedItems,
    delivery_address,
    ...extrainfo
  }) => {
    if (!user || !user.id) {
      throw new Error("User id must be provided.");
    }

    if (!delivery_address) {
      throw new Error("Delivery address must be provided.");
    }

    if (!vendor || !vendor.id) {
      throw new Error("Vendor id must be provided.");
    }

    if (!Array.isArray(orderedItems) || orderedItems.length < 1) {
      throw new Error("Ordered items must be provided enclosed in array.");
    }

    for (let item of orderedItems) {
      let id = item.crop.id;
      let crop = await listCrops({ id });
      if (!crop || crop.length < 1) {
        throw new Error("Invalid crop id provided.");
      }
      crop = crop[0];

      if (crop.vendor_id !== vendor.id) {
        throw new Error("Crop doesn't belong to the vendor provided.");
      }
      item.crop.crop_price = crop.crop_price;
    }

    const order = makeOrder({
      user,
      vendor,
      orderedItems,
      delivery_address,
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

    logOn.core("Place order with options: ", options);

    const placed = orderDb.insert(options);

    return {
      placedCount: 1,
      result: placed,
    };
  });
};
