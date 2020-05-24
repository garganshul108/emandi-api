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
    issue_timestamp,
    user,
    delivery_address,
    vendor,
    orderStatus,
    orderedItems,
  }) => {
    if (id && !valid(id, { type: "number" })) {
      throw new Error("Invalid order id provided.");
    }

    if (issue_timestamp) {
      issueTimestamp = makeTimestamp({ timestamp: issue_timestamp });
    }

    if (user) {
      user = makeUser(user);
    }

    if (vendor) {
      vendor = makeVendor(vendor);
    }

    if (order_status) {
      orderStatus = makeOrderStatus(orderStatus);
    }

    if (delivery_address) {
      delivery_address = sanitize(delivery_address);
      if (!valid(delivery_address, { type: "string" })) {
        throw new Error("Invalid deliveru address is provided.");
      }
    }

    let orderedItemList = [];
    if (orderedItems) {
      for (let item of orderedItems) {
        item = makeOrderedItem(item);
      }
      orderedItemList.push(item);
    }

    return Object.freeze({
      getOrderStatus: () => orderStatus.getStatus(),
      markStatusCancel: () => orderStatus.mark("CANCEL"),
      markStatusCanfirm: () => orderStatus.mark("CONFIRM"),
      getUser: () => user,
      getVendor: () => vendor,
      getId: () => id,
      getIssueTimestamp: () => issueTimestamp.getTimestamp(),
      getDeliveryAddress: () => delivery_address,
      getOrderedItems: () => orderedItemList,
    });
  });
};
