module.exports = makeListOrders = ({ orderDb, filterUndefined }) => {
  return (listOrders = async ({ id, vendor_id, user_id }) => {
    let orders = undefined;
    if (id) {
      orders = await orderDb.findById({ id });
    } else if (user_id || vendor_id) {
      orders = await orderDb.findAllByUserIdAndOrVendorId(
        filterUndefined({
          user_id: user_id || undefined,
          vendor_id: vendor_id || undefined,
        })
      );
    } else {
      orders = await ordersDb.findAll();
    }

    return {
      fetchedCount: 1,
      result: orders,
    };
  });
};
