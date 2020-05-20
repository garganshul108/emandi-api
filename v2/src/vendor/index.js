const router = require("express").router;
const {
  deleteVendor,
  getVendors,
  postVendor,
  patchVendor,
} = require("./controllers");

const makeCallback = require("../express-callback");

router.post("/vendor", makeCallback(postVendor));
router.delete("/vendor/:id", makeCallback(deleteVendor));
router.delete("/vendor", makeCallback(deleteVendor));
router.patch("/vendor/:id", makeCallback(patchVendor));
router.patch("/vendor", makeCallback(patchVendor));
router.get("/vendor", makeCallback(getVendors));
// router.use(makeCallback(notFound));

module.exports = router;
