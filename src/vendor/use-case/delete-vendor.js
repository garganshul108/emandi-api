const makeVendor = require("../vendor");

function makeDeleteVendor({ vendorDb }) {
  async function deleteVendor({ id }) {
    if (!id) {
      throw new Error("Id of the Vendor must be provided");
    }
    const vendor = makeVendor({ id });
    id = vendor.getId();
    const exists = await vendorDb.findById(id);

    if (!exists) {
      return deleteNothing();
    }

    await vendorDb.removeById({ id });
    return {
      deletedCount: 1,
      message: "Vendor Deleted.",
    };
  }

  function deleteNothing() {
    return {
      deletedCount: 0,
      message: "Nothing to delete.",
    };
  }

  return deleteVendor;
}

module.exports = makeDeleteVendor;
