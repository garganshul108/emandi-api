const router = require("express").Router();
const makeExpressCallback = require("../express-callback");

const decodeToken = require("../middleware/decode-token");
const authUser = require("../middleware/auth-user");
const authAdmin = require("../middleware/auth-admin");

const {
  getUserMe,
  getUsers,
  deleteUser,
  deleteUserMe,
  patchUser,
  patchUserMe,
  postUser,
} = require("../src/user/controller");

router.get("/me", [decodeToken, authUser], makeExpressCallback(getUserMe));
router.get("/:id?", [decodeToken], makeExpressCallback(getUsers));

router.delete(
  "/me",
  [decodeToken, authUser],
  makeExpressCallback(deleteUserMe)
);
router.delete(
  "/:id",
  [decodeToken, authAdmin],
  makeExpressCallback(deleteUser)
);

router.patch("/me", [decodeToken, authUser], makeExpressCallback(patchUserMe));
router.patch("/:id", [decodeToken, authAdmin], makeExpressCallback(patchUser));

router.post("/", makeExpressCallback(postUser));

module.exports = router;
