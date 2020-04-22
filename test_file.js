const connection = require("./db/root");
const express = require("express");
const tf = express.Router();

connection.query("Select database() as db;", (err, result) => {
  if (err) return console.log(err);
  console.log("TF", result);
});

tf.get("/", (req, res) => {
  res.send("This is TF");
});

module.exports = tf;
