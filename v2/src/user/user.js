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
    deviceFCMToken,
    contact,
    name,
    pincode,
    cityId,
    stateId,
    regTimestamp,
    address,
    profilePictureURL,
  }) => {
    if (!deviceFCMToken) {
      throw new Error("User's Device FCM Token must be provided.");
    }

    if (!contact) {
      throw new Error("User contact must be provided.");
    }

    if (id && !valid(id, { type: "number" })) {
      throw new Error("Invalid user id provided.");
    }

    deviceFCMToken = makeDeviceFCMToken({ token: deviceFCMToken });

    if (contact && !valid(contact, { type: "number" })) {
      throw new Error("Invalid user contact provided.");
    }

    if (name) {
      name = sanitize(name);
      if (!valid(name, { type: "string" }))
        throw new Error("Invalid user name provided.");
    }

    if (pincode) {
      pincode = makePinCode({ pincode });
    }

    if (regTimestamp) {
      regTimestamp = makeTimestamp({ timestamp: regTimestamp });
    }

    if (address) {
      address = sanitize(address);
      if (!valid(address, { type: "string" })) {
        throw new Error("Invalid user address provided.");
      }
    }

    if (profilePictureURL) {
      profilePictureURL = makeURL({ url: profilePictureURL });
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

  return makeUser;
};

module.exports = buildMakeUser;
