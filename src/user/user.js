const buildMakeUser = ({
  sanitize,
  valid,
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
    if (!device_fcm_token) {
      throw new Error("User's Device FCM Token must be provided.");
    }

    if (!contact) {
      throw new Error("User contact must be provided.");
    }

    if (id && !valid(id, { type: "number" })) {
      throw new Error("Invalid user id provided.");
    }

    if (device_fcm_token) {
      device_fcm_token = makeDeviceFCMToken({ device_fcm_token });
    }

    if (contact && !valid(contact, { type: "number" })) {
      throw new Error("Invalid user contact provided.");
    }

    if (name) {
      name = sanitize(name);
      if (!valid(name, { type: "string" }))
        throw new Error("Invalid user name provided.");
    }

    if (pin_code) {
      pin_code = makePinCode({ pin_code });
    }

    if (reg_timestamp) {
      reg_timestamp = makeTimestamp({ timestamp: reg_timestamp });
    }

    if (address) {
      address = sanitize(address);
      if (!valid(address, { type: "string" })) {
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
      getCity: () => Object.freeze({ getId: () => city.id }),
      getState: () => Object.freeze({ getId: () => state.id }),
      getRegTimestamp: () => reg_timestamp,
      getAddress: () => address,
      getProfilePicture: () => profile_picture,
    });
  };

  return makeUser;
};

module.exports = buildMakeUser;
