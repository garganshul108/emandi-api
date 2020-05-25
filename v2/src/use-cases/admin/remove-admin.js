const makeAdmin = require("../admin");

const makeRemoveAdmin = ({ adminDb }) => {
  const removeAdmin = async ({ username }) => {
    if (!username) {
      throw new Error("No username specified");
    }
    const admin = makeAdmin({ username });
    const existing = await adminDb.findByUsername(admin.getUsername());
    if (!existing) {
      return doNothing();
    }

    await adminDb.removeByUsername(admin.getUsername());
    return {
      message: "Admin deleted.",
      deletedCount: 1,
    };
  };

  const doNothing = () => {
    return {
      message: "Nothing deleted.",
      deletedCount: 0,
    };
  };

  return removeAdmin;
};

module.exports = makeRemoveAdmin;
