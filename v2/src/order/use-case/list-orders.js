module.exports = makeListOrders = ({ orderDb, filterUndefined }) => {
  return (listOrders = async (options) => {
    let orders = undefined;
    if (!options) {
      orders = await orderDb.findAll();
    } else {
      let criteria = filterUndefined({
        vendor_id: vendor.id,
        user_id: user.id,
        id,
      });
      orders = await ordersDb.findAll(criteria);
    }

    return {
      fetchedCount: orders.length,
      result: orders,
    };
  });
};
