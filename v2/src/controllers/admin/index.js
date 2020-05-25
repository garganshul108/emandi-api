const makePostAdmin = require("./post-admin");
const makePostLoginAdmin = require("./post-login-admin");
const makeDeleteAdmin = require("./delete-admin");
const makeGetAdmins = require("./get-admins");

const {
  addAdmin,
  removeAdmin,
  loginAdmin,
  listAdmins,
} = require("../use-case");

const postAdmin = makePostAdmin({ addAdmin });
const deleteAdmin = makeDeleteAdmin({ removeAdmin });
const postLoginAdmin = makePostLoginAdmin({ loginAdmin });
const getAdmins = makeGetAdmins({ listAdmins });

module.exports = {
  postAdmin,
  deleteAdmin,
  postLoginAdmin,
  getAdmins,
};
