module.exports = makeUserDb = ({ makeDb, extract, filterUndefined }) => {
  const findById = async ({ id }) => {
    const db = await makeDb();
    const result = await db.USER.findByPk(id);
    return extract(result);
  };

  const findAll = async (options = {}) => {
    const db = await makeDb();
    options = filterUndefined(options);
    const result = await db.USER.findAll({ where: options });
    return result.length <= 0 ? null : result.map((res) => extract(res));
  };

  const insert = async (info) => {
    const db = await makeDb();
    const result = await db.USER.create({
      name: info.name,
      user_type_id: info.user_type_id,
      vendor_id: info.vendor_id,
      user_qty: info.user_qty,
      user_price: info.user_price,
      description: info.description || null,
    });
    return extract(result);
  };

  const removeById = async ({ id }) => {
    const db = await makeDb();
    const result = await db.USER.destory({ where: { user_id: id } });
    return extract(result);
  };

  const updateById = async ({ id, ...changes }) => {
    const db = await makeDb();
    let result = await db.USER.update(
      { ...changes },
      { where: { user_id: id } }
    );
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
