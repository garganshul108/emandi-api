const makeAdmin = require("../../admin");

const makeAddAdmin = ({ adminDb, generateHash }) => {
  const addAdmin = async ({ username, password }) => {
    const admin = makeAdmin({ username, password });
    const existing = await admin.findByUsername(admin.getUsername());
    if (existing) {
      return {
        insertedCount: 0,
        result: existing,
        message: "Admin with provided username already exists.",
      };
    }

    const hash = await generateHash(admin.getPassword());
    const inserted = adminDb.insert({
      username: admin.getUsername(),
      password: hash,
    });

    return {
      insertedCount: 1,
      result: inserted,
    };
  };

  return addAdmin;
};

module.exports = makeAddAdmin;
