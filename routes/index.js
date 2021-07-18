const router = require("express").Router();

// routes specific to admin action
router.use("/admin", require("./admin"));

router.get("/", (req, res) => {
  return res.status(200).json({
    status: 200,
    message: "Server is up and running",
  });
});

module.exports = router;
