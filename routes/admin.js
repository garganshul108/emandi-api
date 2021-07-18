const router = require("express").Router();
const decodeToken = require("../helper/middleware/decode-token");
const {
  deleteAdmin,
  postAdmin,
  getAdmins,
  postLoginAdmin,
} = require("../src/admin/controller");

const makeCallback = require("../helper/express-callback");

// call to login the admin
router.post("/admin/login", makeCallback(postLoginAdmin));

// add Admin
router.post("/admin", [decodeToken, authAdmin], makeCallback(postAdmin));

router.get("/admin/:username", makeCallback(getAdmins));
router.get("/admin", makeCallback(getAdmins));

router.delete(
  "/admin/:username",
  [decodeToken, authAdmin],
  makeCallback(deleteAdmin)
);

module.exports = router;

/**
 * Who is admin?
 * - Adminstrator of the API; Performs special/previledged actions
 * - Is Farmer an Admin? NO
 * - Is Buyer an Admin? NO
 *
 * Admin Specific Actions
 * - Create/Delete Groups
 * - Create/Delete Permissions
 * - Give/Take-off Permissions from a Group
 * - Add user to a group
 *
 * Special Admin Name - Root
 *
 *
 */
