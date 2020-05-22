const makeDeleteUser = require("./delete-user");
const makeDeleteUserMe = require("./delete-user-me");
const makeGetUserMe = require("./get-user-me");
const makeGetUsers = require("./get-users");
const makePatchUserMe = require("./patch-user-me");
const makePatchUser = require("./patch-user");
const makePostUser = require("./post-user-via-otp");

const { addUser, listUsers, removeUser, updateUser } = require("../use-case");

const postUser = makePostUser({ addUser });
const patchUser = makePatchUser({ updateUser });
const patchUserMe = makePatchUserMe({ updateUser });
const getUsers = makeGetUsers({ listUsers });
const getUserMe = makeGetUserMe({ listUsers });
const deleteUser = makeDeleteUser({ removeUser });
const deleteUserMe = makeDeleteUserMe({ removeUser });

module.exports = {
  postUser,
  patchUser,
  patchUserMe,
  getUsers,
  getUserMe,
  deleteUser,
  deleteUserMe,
};
