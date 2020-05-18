module.exports = function buildMakeUser({ valid, dateFormater, makeAddress }) {
  return function makeUser({
    id,
    device_fcm_token,
    contact,
    name,
    address,
    profile_picture,
    reg_timestamp = Date.now(),
  } = {}) {
    if (!contact) {
      throw new Error("User must have a contact number");
    }
    if (!device_fcm_token) {
      throw new Error(
        "User must have a device recognition string (device_fcm_token)"
      );
    }
    if (
      name &&
      !valid(name, { type: "string", minLength: 2, onlyAlphabets: true })
    ) {
      throw new Error("User's name must be a valid, if provided");
    }
    if (state_id && !valid(state_id, { type: "number", minValue: 1 })) {
      throw new Error("User's state_id must be a valid number, if provided");
    }
    if (city_id && !valid(city_id, { type: "number", minValue: 1 })) {
      throw new Error("User's city_id must be a valid number, if provided");
    }
    if (pin_code && !valid(pin_code, { type: "number", minValue: 1 })) {
      throw new Error("User's pin_code must be a valid number, if provided");
    }
    if (address && !valid(address, { type: "string", alphanumberic: true })) {
      throw new Error("User's address should be a valid string");
    }

    if (
      profile_picture &&
      !valid(profile_picture, { type: "string", specs: ["url"] })
    ) {
      throw new Error("User's profile picture is not a valid url");
    }

    reg_timestamp = dateFormater(reg_timestamp);
    // filling up the user object
    address = makeAddress(address);
    return Object.freeze({
      // utilities this object provide
      // get functions
      // edit functions
      getName: () => name,
      getId: () => {
        if (!id) {
          throw new Error("User's id is not assigned");
        }
      },
      getContact: () => contact,
      getAddress: () => address,
      getOptions: () => {
        profile_picture, device_fcm_token, reg_timestamp;
      },
      setId: (_id) => {
        id = _id;
      },
    });
  };
};
