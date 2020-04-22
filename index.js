const express = require("express");
const connection = require("./db/root");
const app = express();
const PORT = process.env.PORT || 8080;
const config = require("config");

const tf = require("./test_file");

app.use("/tf", tf);

connection.query("Select database() as db_name;", (err, result) => {
  if (err) throw err;
  console.log("Result: ", result[0].db_name);
});

app.get("/", (req, res) => {
  res.write("Emandi Server is active");
  res.end();
});

app.listen(PORT, () => {
  console.log(`Listening to Port ${PORT}`);
});
