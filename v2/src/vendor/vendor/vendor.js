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
    device_fcm_token,
    contact,
    name,
    address,
    profile_picture,
    reg_timestamp,
    city = {},
    state = {},
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
    if (city) {
      city = makeCity(city);
    }

    if (state) {
      state = makeState(state);
    }

    const validId = null;
    if (id && !valid(id, {})) {
      throw new Error("Invalid Vendor Id provided.");
    }

    if (device_fcm_token) {
      device_fcm_token = makeDeviceFCMToken({ device_fcm_token });
    }

    if (profile_picture) {
      profile_picture = makeURL({ url: profile_picture });
    }

    if (reg_timestamp) {
      reg_timestamp = makeTimestamp({ timestamp: reg_timestamp });
    }

    return Object.freeze({
      getName: () => name,
      getId: () => id,
      getDeviceFCMToken: () => device_fcm_token,
      getContact: () => contact,
      getPinCode: () => pin_code,
      getCity: () => city,
      getState: () => state,
      getRegTimestamp: () => reg_timestamp,
      getAddress: () => address,
      getProfilePicture: () => profile_picture,
    });
  };
}

module.exports = buildMakeVendor;
