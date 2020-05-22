const router = require("express").Router();
const decodeToken = require("../middleware/decode-token");
const {
  deleteAdmin,
  postAdmin,
  getAdmins,
  postLoginAdmin,
} = require("../src/admin/controller");

const makeCallback = require("../express-callback");

router.post("/admin/login", makeCallback(postLoginAdmin));
router.post("/admin", [decodeToken, authAdmin], makeCallback(postAdmin));

router.get("/admin/:username", makeCallback(getAdmins));
router.get("/admin", makeCallback(getAdmins));

router.delete(
  "/admin/:username",
  [decodeToken, authAdmin],
  makeCallback(deleteAdmin)
);

module.exports = router;
