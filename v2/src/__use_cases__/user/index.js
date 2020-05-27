const makeAddUser = require("./add-user");
const makeListUsers = require("./list-users");
const makeRemoveUser = require("./remove-user");
const makeUpdateUser = require("./update-user");

const filterUndefined = require("../../../helper/util/filter-undefined");

const addUser = makeAddUser({ userDb, filterUndefined });
const listUsers = makeListUsers({ userDb });
const removeUser = makeRemoveUser({ userDb });
const updateUser = makeUpdateUser({ userDb, filterUndefined });

module.exports = {
  addUser,
  listUsers,
  removeUser,
  updateUser,
};
