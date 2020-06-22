function buildMakeVendor({
  valid,
  makeDeviceFCMToken,
  makeTimestamp,
  makeURL,
  sanitize,
  makeCity,
  makeState,
  makeURL,
}) {
  return function makeVendor({
    id,
    deviceFCMToken,
    contact,
    name,
    address,
    profilePictureURL,
    regTimestamp,
    pincode,
    cityId,
    stateId,
  } = {}) {
    if (name && !valid(name, { type: "string", minLength: 3 })) {
      throw new Error("Invalid vendor name provided");
    }

    name = sanitize(name).trim();
    if (name.length < 3) {
      throw new Error("Vendor's name has no permissable characters");
    }

    if (contact && !valid(contact, { type: "number", exactDigitCount: 10 })) {
      throw new Error("Invalid vendor contact.");
    }

    if (id && !valid(id, { type: "number" })) {
      throw new Error("Invalid Vendor Id provided.");
    }

    if (deviceFCMToken) {
      deviceFCMToken = makeDeviceFCMToken({ deviceFCMToken });
    }

    if (profilePictureURL) {
      profilePictureURL = makeURL({ url: profilePictureURL });
    }

    if (regTimestamp) {
      regTimestamp = makeTimestamp({ timestamp: regTimestamp });
    }

    return Object.freeze({
      getName: () => name,
      getId: () => id,
      getDeviceFCMToken: () => deviceFCMToken,
      getContact: () => contact,
      getPinCode: () => pincode,
      getCityId: () => cityId,
      getStateId: () => stateId,
      getRegTimestamp: () => regTimestamp,
      getAddress: () => address,
      getProfilePicture: () => profilePictureURL,
    });
  };
}

module.exports = buildMakeVendor;
