const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const app = express();
const PORT = process.env.PORT || 8080;
const path = require("path");

app.listen(PORT, () => {
  console.log(`Listening to ${PORT}...`);
});

const morgan = require("morgan");
const login = require("./routes/login");
const state = require("./routes/state");
const city = require("./routes/city");
const otp_login = require("./routes/otp_login");
const otp_signup = require("./routes/otp_signup");
const crop = require("./routes/crop");
const order = require("./routes/order");
const upload = require("./routes/upload");

const vendor = require("./routes/vendor");
const user = require("./routes/user");

const cropType = require("./routes/crop_type");

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// STATIC FILE SERVING
app.use(
  "/images",
  express.static(path.join(__dirname, "public/uploads/images"))
);

app.use(
  "/defaults/crop_type/fruits",
  express.static(path.join(__dirname, "public/defaults/crop_type/fruits"))
);
app.use(
  "/defaults/crop_type/grains",
  express.static(path.join(__dirname, "public/defaults/crop_type/grains"))
);
app.use(
  "/defaults/crop_type/vegetables",
  express.static(path.join(__dirname, "public/defaults/crop_type/vegetables"))
);

app.use(helmet());
app.use(compression());

app.use("/upload", upload);
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

// (async () => {
//   const { hash } = require("./util/hash");
//   console.log(await hash(""));
// })();

// let uri = "https://emandi-api.herokuapp.com";
// const f = `('Garlic','VEGETABLES','${uri}/defaults/crop_type/vegetables/garlic.jpg'),
// ('Okra','VEGETABLES','${uri}/defaults/crop_type/vegetables/okra.jpg'),
// ('Cucumber','VEGETABLES','${uri}/defaults/crop_type/vegetables/cucumber.jpg'),
// ('Peas','VEGETABLES','${uri}/defaults/crop_type/vegetables/frozen_peas.jpg'),
// ('Apple','FRUITS','${uri}/defaults/crop_type/fruits/apple.jpg'),
// ('Banana','FRUITS','${uri}/defaults/crop_type/fruits/banana.jpg'),
// ('Grapes','FRUITS','${uri}/defaults/crop_type/fruits/grapes.jpg'),
// ('Orange','FRUITS','${uri}/defaults/crop_type/fruits/orange.jpg'),
// ('Barley','GRAINS','${uri}/defaults/crop_type/grains/barley.jpg'),
// ('Oats','GRAINS','${uri}/defaults/crop_type/grains/oats.jpg'),
// ('Quinoa','GRAINS','${uri}/defaults/crop_type/grains/quinoa.jpg'),
// ('Rice','GRAINS','${uri}/defaults/crop_type/grains/rice.jpg')`;

// console.log(f);
