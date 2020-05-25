const buildMakeUser = ({
  sanitize,
  valid,
  makeCity,
  makeState,
  makeTimestamp,
  makeDeviceFCMToken,
  makePinCode,
  makeURL,
}) => {
  const makeUser = ({
    id,
    device_fcm_token,
    contact,
    name,
    pin_code,
    city = {},
    state = {},
    reg_timestamp,
    address,
    profile_picture,
  }) => {
    if (id && !valid(id, {})) {
      throw new Error("Invalid user id provided");
    }

    if (device_fcm_token) {
      device_fcm_token = makeDeviceFCMToken({ device_fcm_token });
    }

    if (contact && !valid(contact, {})) {
      throw new Error("Invalid user contact provided.");
    }

    if (name && !valid(name, {})) {
      throw new Error("Invalid user name provided.");
    }

    if (pin_code) {
      pin_code = makePinCode({ pin_code });
    }

    if (city) {
      city = makeCity(city);
    }

    if (state) {
      state = makeState(state);
    }

    if (reg_timestamp) {
      reg_timestamp = makeTimestamp({ timestamp: reg_timestamp });
    }

    if (address) {
      address = sanitize(address);
      if (!valid(address, {})) {
        throw new Error("Invalid user address provided.");
      }
    }

    if (profile_picture) {
      profile_picture = makeURL({ url: profile_picture });
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

  return makeUser;
};

module.exports = buildMakeUser;
