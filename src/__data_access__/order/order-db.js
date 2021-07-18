module.exports = makeOrderDb = ({ makeDb, extract, filterUndefined }) => {
  const findById = async ({ id }) => {
    const db = await makeDb();
    const result = await db.ORDERS.findByPk(id);
    return extract(result);
  };
  const findAll = async (options = {}) => {
    const db = await makeDb();
    options = filterUndefined(options);
    const result = await db.ORDERS.findAll({ where: options });
    return result.length <= 0 ? null : result.map((res) => extract(res));
  };
  const insert = async (info) => {
    const db = await makeDb();
    const result = await db.ORDERS.create({
      user_id: info.user_id,
      vendor_id: info.vendor_id,
      order_price: info.order_price,
    });
    return extract(result);
  };

  const updateById = async ({ id, changeInQty, ...changes }) => {
    const db = await makeDb();
    let result = await db.ORDERS.update(
      { ...changes },
      { where: { order_id: id } }
    );
    if (changeInQty) {
      result = await db.ORDERS.increment("order_qty", {
        by: changeInQty,
        where: { order_id: id },
      });
    }
    return extract(result);
  };

  return Object.freeze({
    findAll,
    findById,
    insert,
    removeById,
    updateById,
  });
};
