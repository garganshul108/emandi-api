const makeUser = require("../../user");

module.exports = makeUpdateUser = ({ userDb, filterUndefined }) => {
  return (addUser = async ({ id, ...changes }) => {
    if (!id) {
      throw new Error("User id must be provided.");
    }

    const existing = await userDb.findById({ id });
    if (!existing) {
      return {
        updatedCount: 0,
        message: "No user exists with provided user id.",
      };
    }

    const userInfo = { ...existing, ...changes };
    const user = makeUser(userInfo);
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
    const updated = userDb.updateById(options);
    return {
      updatedCount: 1,
      message: "User updated successfully",
      result: updated,
    };
  });
};
