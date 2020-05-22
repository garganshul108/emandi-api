const makeAdmin = require("../admin");

const makeAddAdmin = ({ adminDb, generateHash }) => {
  const addAdmin = async ({ username, password }) => {
    if (!username || !password) {
      throw new Error("No username or password specified");
    }
    const admin = makeAdmin({ username, password });
    const existing = await admin.findByUsername(admin.getUsername());
    if (existing) {
      return existing;
    }

    const hash = await generateHash(admin.getPassword());
    const inserted = adminDb.insert({
      username: admin.getUsername(),
      password: hash,
    });

    return {
      insertedCount: inserted.length,
      result: inserted,
    };
  };

  return addAdmin;
};

module.exports = makeAddAdmin;
