function buildMakeVendor({
  isValid,
  makeAddress,
  makeDeviceFCMToken,
  makeTimestamp,
  makeProfilePicture,
  makeId,
  sanitize,
}) {
  return function makeVendor({
    id,
    device_fcm_token,
    contact,
    name,
    address,
    profile_picture,
    reg_timestamp,
  } = {}) {
    if (name && !isValid(name, { type: "string", minLength: 3 })) {
      throw new Error("Vendor's name is not valid");
    }

    name = sanitize(name).trim();
    if (name.length < 3) {
      throw new Error("Vendor's name has no permissable characters");
    }

    if (contact && !isValid(contact, { type: "number", exactDigitCount: 10 })) {
      throw new Error("Vendor's contact is not valid");
    }

    const validId = null;
    if (id) {
      validId = makeId(id);
    }

    const validDeviceFCMToken = null;
    if (device_fcm_token) {
      validDeviceFCMToken = makeDeviceFCMToken(device_fcm_token);
    }

    const validProfilePicture = null;
    if (profile_picture) {
      validProfilePicture = makeProfilePicture(profile_picture);
    }

    const validRegTimestamp = null;
    if (reg_timestamp) {
      validRegTimestamp = makeTimestamp(reg_timestamp);
    }

    const validAddress = null;
    if (address) {
      validAddress = makeAddress(address);
    }

    return Object.freeze({
      getAddress: () => validAddress,
      getName: () => name,
      getContact: () => contact,
      getProfilePicture: () => validProfile_picture,
      getId: () => validId,
      getDeviceFCMToken: () => validDeviceFCMToken,
      getRegTimestamp: () => validRegTimestamp,
    });
  };
}

module.exports = buildMakeVendor;
