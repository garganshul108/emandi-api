const makeAdmin = require(".");

const makeListAdmins = ({ adminDb }) => {
  const listAdmins = async ({ username }) => {
    if (username) {
      const admin = makeAdmin({ username });
      const existing = await adminDb.findByUsername(admin.getUsername());
      if (!existing) {
        return {
          foundCount: 0,
          message: "No admin with given username.",
        };
      }
      return {
        foundCount: 1,
        result: existing,
      };
    }

    const allAdmins = await adminDb.findAll();
    return {
      foundCount: allAdmins.length,
      result: allAdmins,
    };
  };

  return listAdmins;
};

module.exports = makeListAdmins;
