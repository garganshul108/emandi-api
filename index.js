const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const app = express();
const PORT = process.env.PORT || 8080;

require("./LogOn");

app.listen(PORT, () => {
  console.log(`Listening to ${PORT}...`);
});
const _v2 = require("./v2");
const morgan = require("morgan");
const login = require("./routes/login");
const state = require("./routes/state");
const city = require("./routes/city");
const otp_login = require("./routes/otp_login");
const otp_signup = require("./routes/otp_signup");
const crop = require("./routes/crop");
const order = require("./routes/order");

const vendor = require("./routes/vendor");
const user = require("./routes/user");

const cropType = require("./routes/crop_type");

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(helmet());
app.use(compression());

app.use("/v2", _v2);

app.use("/login", login);
app.use("/otp_login", otp_login);
app.use("/otp_signup", otp_signup);
app.use("/state", state);
app.use("/city", city);
app.use("/vendor", vendor);
app.use("/user", user);
app.use("/crop_type", cropType);
app.use("/crop", crop);
app.use("/order", order);

app.get("/", (req, res) => {
  return res
    .status(200)
    .send(
      "<h1 style=\"font-family: 'Fira Code';\">Server is up and running...<h1>"
    );
});
