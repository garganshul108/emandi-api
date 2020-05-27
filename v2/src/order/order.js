module.exports = buildMakeOrder = ({
  valid,
  makeTimestamp,
  makeOrderedItem,
  sanitize,
}) => {
  return (makeOrder = ({
    id,
    user,
    delivery_address,
    vendor,
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

    if (!user || !user.id) {
      throw new Error("User id must be provided.");
    }

    if (!vendor || !vendor.id) {
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
        throw new Error("Invalid deliveru address is provided.");
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
      cancel: () => {
        for (let item of orderedItemList) {
          item.cancelDispatch();
        }
        orderStatus.markCancel();
        return orderedItemList;
      },
      confirm: () => {
        for (let item of orderedItemList) {
          item.dispatch();
        }
        orderStatus.markConfirm();
        return orderedItemList;
      },
      getUser: () => user,
      getVendor: () => vendor,
      getId: () => id,
      getIssueTimestamp: () => issueTimestamp.getTimestamp(),
      getDeliveryAddress: () => delivery_address,
      getOrderedItems: () => orderedItemList,
      getCheckoutValue: () => checkoutValue,
    });
  });
};
