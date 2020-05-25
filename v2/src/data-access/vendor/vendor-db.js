function makeVendorDb({ makeDb }) {
  return Object.freeze({
    findAll,
    findById,
    insert,
    removeById,
    updateById,
  });

  async function findAll() {
    const db = await makeDb();
    const result = await db.VENDOR.findAll();
    return result;
  }

  async function findById({ id }) {
    const db = await makeDb();
    const result = await db.VENDOR.findBYPk(id);
    return result;
  }

  async function insert(vendorInfo) {
    if (vendorInfo.address) {
      const { state_id, city_id, long_address: address } = vendorInfo.address;
      delete vendorInfo.address;
      vendorInfo = { ...vendorInfo, state_id, city_id, address };
    }
    const db = makeDb();
    const result = await db.VENDOR.create({
      ...vendorInfo,
    });
    return result;
  }

  async function updateById({ id, ...vendorInfo }) {
    if (vendorInfo.address) {
      const { state_id, city_id, long_address: address } = vendorInfo.address;
      delete vendorInfo.address;
      vendorInfo = { ...vendorInfo, state_id, city_id, address };
    }
    const db = await makeDb();
    const result = await db.VENDOR.update(
      { ...vendorInfo },
      { where: { vendor_id: id } }
    );
    return result;
  }

  async function removeById({ id }) {
    const db = await makeDb();
    const result = await db.VENDOR.destroy({ where: id });
    return result;
  }
}

module.exports = makeVendorDb;
