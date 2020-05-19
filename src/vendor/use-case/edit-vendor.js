const makeVendor = require("../vendor");

function makeEditVendor({ vendorDb }) {
  async function editVendor({ id, ...changes }) {
    if (!id) {
      throw new Error("Id of the Vendor must be provided");
    }
    if (changes.contact || changes.reg_timestamp) {
      throw new Error("Contact/Registation Timestamp can't be modified");
    }
    const vendor = makeVendor({ id });
    const existing = await vendorDb.findById(vendor.getId());
    if (!existing) {
      throw new RangeError("Vendor doesn't exists with this id");
    }

    vendor = makeVendor({ ...existing, ...changes });
    const vendorAddress = vendor.getAddress();
    const updated = await vendorDb.update({
      id: vendor.getId(),
      device_fcm_token: vendor.getDeviceFCMToken(),
      contact: vendor.getContact(),
      name: vendor.getName(),
      address: {
        state_id: vendorAddress.getStateId(),
        city_id: vendorAddress.getCityId(),
        long_address: vendorAddress.getLongAddress(),
      },
      profile_picture: vendor.getProfilePicture(),
      reg_timestamp: vendor.getRegTimestamp(),
    });
    return { ...existing, ...updated };
  }

  return editVendor;
}

module.exports = makeEditVendor;
