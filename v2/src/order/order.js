module.exports = buildMakeOrder = ({
  valid,
  makeTimestamp,
  makeOrderedItem,
  sanitize,
}) => {
  return (makeOrder = ({
    id,
    userId,
    deliveryAddress,
    vendorId,
    orderedItems,
    issueTimestamp,
    orderStatus,
  }) => {
    if (id && !valid(id, { type: "number" })) {
      throw new Error("Invalid order id provided.");
    }

    if (!issueTimestamp) {
      issueTimestamp = makeTimestamp({ timestamp: new Date() });
    }

    if (!userId) {
      throw new Error("User id must be provided.");
    }

    if (!vendorId) {
      throw new Error("Vendor id must be provided.");
    }

    if (!orderStatus) {
      orderStatus = makeOrderStatus({ status: "PENDING" });
    } else {
      orderStatus = makeOrderStatus(orderStatus);
    }

    if (!deliveryAddress) {
      throw new Error("Delivery address must be provided.");
    }

    deliveryAddress = sanitize(deliveryAddress);
    if (!valid(deliveryAddress, { type: "string" })) {
      throw new Error("Invalid delivery address is provided.");
    }

    if (!Array.isArray(orderedItems) || orderedItems.length < 1) {
      throw new Error("Ordered items must be provided enclosed in array.");
    }

    let checkoutValue = 0;
    let orderedItemList = [];
    if (orderedItems) {
      for (let item of orderedItems) {
        item = makeOrderedItem(item);
      }
      checkoutValue += item.getItemFreezedCost();
      orderedItemList.push(item);
    }

    return Object.freeze({
      getOrderStatus: () => orderStatus.getStatus(),
      getUser: () => Object.freeze({ getId: () => user.id }),
      getVendor: () => Object.freeze({ getId: () => vendor.id }),
      getId: () => id,
      getIssueTimestamp: () => issueTimestamp.getTimestamp(),
      getDeliveryAddress: () => delivery_address,
      getOrderedItems: () => orderedItemList,
      getCheckoutValue: () => checkoutValue,
    });
  });
};
