module.exports = buildMakeOrder = ({
  valid,
  makeTimestamp,
  makeUser,
  makeVendor,
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

    if (user) {
      user = makeUser(user);
    }

    if (vendor) {
      vendor = makeVendor(vendor);
    }
    if (!orderStatus) {
      orderStatus = makeOrderStatus({ status: "PENDING" });
    } else {
      orderStatus = makeOrderStatus(orderStatus);
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
      markStatusCancel: () => {
        orderStatus.markCancel();
      },
      markStatusCanfirm: () => {
        orderStatus.markConfirm();
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
