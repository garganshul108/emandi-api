const makeAdmin = require("../../admin");

const makeLoginAdmin = ({ adminDb, compareHash }) => {
  const loginAdmin = async ({ username, password }) => {
    if (!username || !password) {
      throw new Error("No username or password specified");
    }
    const admin = makeAdmin({ username, password });
    const existing = await adminDb.findByUsername(admin.getUsername());
    if (!existing) {
      return {
        foundCount: 0,
        message: "Admin not found.",
      };
    }

    const passwordIsEquivalent = await compareHash(
      existing.password,
      admin.getPassword()
    );
    if (passwordIsEquivalent) {
      return {
        foundCount: 1,
        valid: 1,
        result: existing,
      };
    } else {
      return {
        foundCount: 1,
        valid: 0,
        message: "Invalid credentials pairing.",
      };
    }
  };

  return loginAdmin;
};

module.exports = makeLoginAdmin;
