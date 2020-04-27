const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const app = express();
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Listening to ${PORT}...`);
});

const morgan = require("morgan");

const login = require("./routes/login");
const state = require("./routes/state");
const city = require("./routes/city");
const otp_login = require("./routes/otp_login");
const otp_signup = require("./routes/otp_signup");

const vendor = require("./routes/vendor");
const user = require("./routes/user");

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(helmet());
app.use(compression());

app.use("/login", login);
app.use("/otp_login", otp_login);
app.use("/otp_signup", otp_signup);
app.use("/state", state);
app.use("/city", city);
app.use("/vendor", vendor);
app.use("/user", user);

app.get("/", (req, res) => {
  return res
    .status(200)
    .send(
      "<h1 style=\"font-family: 'Fira Code';\">Server is up and running...<h1>"
    );
});

// app.use("/state", state);

// app.post("/city", (req, res) => {});

// app.post("/vendor", (req, res) => {});

// app.get("/login", (req, res) => {
//   res.send("Login Workspace");
// });

// app.get("/", (req, res) => {
//   res.send("Root Workspace");
// });

// //
// console.log("-----------------");
// const sendOTP = require("./util/sendOTP");

// (async () => {
//   try {
//     const tt = await sendOTP("760749151", "otp-template-2", "7607491516|13345");
//     console.log("tt", tt);
//   } catch (ex) {
//     console.log("Exception block");
//     console.log(ex);
//   }
// })();

//
// const connectionPool = require("./db/pool");
// (() => {
//   connectionPool.getConnection((err, connection) => {
//     if (err) {
//       console.log("INDEX");
//       throw err;
//     }
//     console.log("ROLLBACK BEFORE: ", connection.rollback);
//     connection.beginTransaction((err) => {
//       if (err) {
//         console.log("INDEX");
//         throw err;
//       }
//     });
//   });
// })();
