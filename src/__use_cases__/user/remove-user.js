module.exports = makeRemoveUser = ({ userDb }) => {
  return (removeUser = async ({ id }) => {
    if (!id) {
      throw new Error("User id must be provided.");
    }

    const existing = userDb.findById({ id });
    if (!existing) {
      return {
        deletedCount: 0,
        message: "No user exists with provided user id.",
      };
    }

    await userDb.removeById({ id });
    return {
      deletedCount: 1,
      message: "User has been deleted successfully.",
    };
  });
};
