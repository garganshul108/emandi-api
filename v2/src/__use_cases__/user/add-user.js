const makeUser = require("../../user");

const makeAddUser = ({ filterUndefined }) => {
  const addUser = async (userInfo) => {
    const user = makeUser(userInfo);
    const existing = await userDb.findUserByContact({
      contact: user.getContact(),
    });
    if (existing) {
      return {
        insertedCount: 0,
        result: existing,
        message: "User with given contact already exists.",
      };
    }

    const options = filterUndefined({
      device_fcm_token: user.getDeviceFCMToken().getToken(),
      contact: user.getContact(),
      name: user.getName() || undefined,
      pin_code: user.getPinCode() || undefined,
      city_id: user.getCity().getId() || undefined,
      state_id: user.getState().getId() || undefined,
      reg_timestamp: user.getRegTimestamp().getTimestamp() || undefined,
      address: user.getAddress() || undefined,
      profile_picture: user.getProfilePicture().getURL() || undefined,
    });

    const inserted = await userDb.insert(options);
    return {
      insertedCount: 1,
      result: inserted,
    };
  };
  return addUser;
};

module.exports = makeAddUser;
