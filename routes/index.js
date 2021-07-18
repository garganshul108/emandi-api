// const login = require("./routes/login");
// const state = require("./routes/state");
// const city = require("./routes/city");
// const otp_login = require("./routes/otp_login");
// const otp_signup = require("./routes/otp_signup");
// const crop = require("./routes/crop");
// const order = require("./routes/order");

// const vendor = require("./routes/vendor");
// const user = require("./routes/user");

// const cropType = require("./routes/crop_type");

const router = require("express").Router();

// router.use("/login", login);
// router.use("/otp_login", otp_login);
// router.use("/otp_signup", otp_signup);
// router.use("/state", state);
// router.use("/city", city);
// router.use("/vendor", vendor);
// router.use("/user", user);
// router.use("/crop_type", cropType);
// router.use("/crop", crop);
// router.use("/order", order);

router.get("/", (req, res) => {
  return res.status(200).json({
    status: 200,
    message: "Server is up and running",
  });
});

module.exports = router;
