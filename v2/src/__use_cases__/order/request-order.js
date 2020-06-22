const makeOrder = require("../../order");
module.exports = makePlaceOrder = ({
  dirtyCache,
  orderDb,
  listCrops,
  filterUndefined,
}) => {
  const unCacheIds = (ids) => {
    ids.map((id) => {
      dirtyCache.remove({ id });
    });
  };
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

    let cachedIds = [];

    for (let item of orderedItems) {
      if (!item.cropId) {
        unCacheIds(cachedIds);
        throw new Error("Crop id for the item must be provided.");
      }

      let cId = item.cropId;

      let crop = await listCrops({ id: cId });
      if (!crop) {
        unCacheIds(cachedIds);
        throw new Error("No crop found with the provided id.");
      }

      if (crop.vendor.id !== vendorId) {
        unCacheIds(cachedIds);
        throw new Error(
          `Crop with id as ${cropId} doesn't belong to the vendor provided.`
        );
      }

      dirtyCache.add({ id: cId });
      cachedIds.push(cId);

      item.crop = crop;
    }

    const order = makeOrder({
      userId,
      vendorId,
      orderedItems,
      delivery_address,
      ...extraInfo,
    });

    try {
      const options = filterUndefined({
        user_id: order.getUser().getId(),
        vendor_id: order.getVendor().getId(),
        delivery_address: order.getDeliveryAddress(),
        ordered_items: order.getOrderedItems(),
        order_status: order.getOrderStatus().getStatus(),
        issue_timestamp: order.getIssueTimestamp(),
        checkout_value: order.getCheckoutValue(),
      });

      const requested = await orderDb.request(options);
      return {
        requestedCount: 1,
        result: requested,
      };
    } finally {
      unCacheIds(cachedIds);
    }
  });
};
