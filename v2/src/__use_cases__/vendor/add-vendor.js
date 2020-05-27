const makeVendor = require("../../vendor");

function makeAddVendor({ vendorDb }) {
  async function addVendor(vendorInfo) {
    const vendor = makeVendor(vendorInfo);
    const exists = await vendorDb.findByContact(vendor.getContact());
    if (exists) {
      throw new Error("Vendor already exists with this contact");
    }

    const vendorAddress = vendor.getAddress();
    return vendorDb.insert({
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
  }

  return addVendor;
}

module.exports = makeAddVendor;
