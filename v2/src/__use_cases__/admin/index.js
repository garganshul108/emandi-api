const makeAddAdmin = require("./add-admin");
const makeLoginAdmin = require("./login-admin");
const makeRemoveAdmin = require("./remove-admin");
const makeListAdmins = require("./list-admins");

const adminDb = require("../../__data_access__/admin");
const { hash, compare } = require("../../../../util/hash");

const compareHash = async (newValue, oldHash) => {
  return await compare(newValue, oldHash);
};

const generateHash = async (text) => await hash(text);

const addAdmin = makeAddAdmin({ adminDb, generateHash });
const loginAdmin = makeLoginAdmin({ adminDb, compareHash });
const removeAdmin = makeRemoveAdmin({ adminDb });
const listAdmins = makeListAdmins({ adminDb });

module.exports = {
  addAdmin,
  loginAdmin,
  removeAdmin,
  listAdmins,
};
