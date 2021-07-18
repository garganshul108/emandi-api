module.exports = makeCropDb = ({ makeDb, extract, filterUndefined }) => {
  const findById = async ({ id }) => {
    const db = await makeDb();
    const result = await db.CROP.findByPk(id);
    return extract(result);
  };
  const findAll = async (options = {}) => {
    const db = await makeDb();
    options = filterUndefined(options);
    const result = await db.CROP.findAll({ where: options });
    return result.length <= 0 ? null : result.map((res) => extract(res));
  };
  const insert = async (info) => {
    const db = await makeDb();
    const result = await db.CROP.create({
      crop_name: info.crop_name,
      crop_type_id: info.crop_type_id,
      vendor_id: info.vendor_id,
      crop_qty: info.crop_qty,
      crop_price: info.crop_price,
      description: info.description || null,
    });
    return extract(result);
  };
  const removeById = async ({ id }) => {
    const db = await makeDb();
    const result = await db.CROP.destory({ where: { crop_id: id } });
    return extract(result);
  };
  const updateById = async ({ id, changeInQty, ...changes }) => {
    const db = await makeDb();
    let result = await db.CROP.update(
      { ...changes },
      { where: { crop_id: id } }
    );
    if (changeInQty) {
      result = await db.CROP.increment("crop_qty", {
        by: changeInQty,
        where: { crop_id: id },
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
