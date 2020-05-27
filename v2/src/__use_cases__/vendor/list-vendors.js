const makeVendor = require("../../vendor");

function makeListVendors({ vendorDb }) {
  async function listVendors({ id }) {
    if (!id) {
      const vendors = await vendorDb.findAll();
      return vendors;
    }

    const vendor = makeVendor({ id });
    const existing = await vendorDb.findById(vendor.id);
    if (!existing) {
      return sendNothing();
    }
    return [existing];
  }

  function sendNothing() {
    return [];
  }

  return listVendors;
}

module.exports = makeListVendors;
