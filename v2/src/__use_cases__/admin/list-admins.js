const makeAdmin = require("../../admin");

const makeListAdmins = ({ adminDb }) => {
  const listAdmins = async ({ username }) => {
    if (username) {
      const existing = await adminDb.findByUsername(admin.getUsername());
      if (!existing) {
        return {
          fetchedCount: 0,
          message: "No admin with given username.",
        };
      }
      return {
        fetchedCount: 1,
        result: existing,
      };
    }

    const allAdmins = await adminDb.findAll();
    return {
      fetchedCount: allAdmins.length,
      result: allAdmins,
    };
  };

  return listAdmins;
};

module.exports = makeListAdmins;
