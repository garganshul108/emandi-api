const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const app = express();
const PORT = process.env.PORT || 8080;

const morgan = require("morgan");

const login = require("./routes/login");
const state = require("./routes/state");
const city = require("./routes/city");

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(helmet());
app.use(compression());

app.use("/login", login);
app.use("/state", state);
app.use("/city", city);
// app.use("/state", state);

// app.post("/city", (req, res) => {});

// app.post("/vendor", (req, res) => {});

// app.get("/login", (req, res) => {
//   res.send("Login Workspace");
// });

// app.get("/", (req, res) => {
//   res.send("Root Workspace");
// });

app.listen(PORT, () => {
  console.log(`Listening to ${PORT}...`);
});
