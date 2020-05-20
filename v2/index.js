const router = require("express").Router();
const vendor = require("./src/vendor");

router.use("/vendor", vendor);

module.exports = router;
