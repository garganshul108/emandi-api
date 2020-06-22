module.exports = buildMakeOrder = ({
  valid,
  makeTimestamp,
  makeOrderedItem,
  sanitize,
}) => {
  return (makeOrder = ({
    id,
    userId,
    delivery_address,
    vendorId,
    orderedItems,
    issueTimestamp,
    orderStatus,
  }) => {
    if (id && !valid(id, { type: "number" })) {
      throw new Error("Invalid order id provided.");
    }

    if (!Array.isArray(orderedItems) || orderedItems.length < 1) {
      throw new Error("Ordered items must be provided enclosed in array.");
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

    if (!delivery_address) {
      throw new Error("Delivery address must be provided.");
    }

    if (delivery_address) {
      delivery_address = sanitize(delivery_address);
      if (!valid(delivery_address, { type: "string" })) {
        throw new Error("Invalid delivery address is provided.");
      }
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
      cancel: async (transactionKey) => {
        for (let item of orderedItemList) {
          await item.cancelDispatch(transactionKey);
        }
        orderStatus.markCancel();
        return orderedItemList;
      },
      confirm: async (transactionKey) => {
        for (let item of orderedItemList) {
          await item.dispatch(transactionKey);
        }
        orderStatus.markConfirm();
        return orderedItemList;
      },
      getUserId: () => userId,
      getVendorId: () => vendorId,
      getId: () => id,
      getIssueTimestamp: () => issueTimestamp.getTimestamp(),
      getDeliveryAddress: () => delivery_address,
      getOrderedItems: () => orderedItemList,
      getCheckoutValue: () => checkoutValue,
    });
  });
};
