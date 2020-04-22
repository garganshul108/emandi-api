const mysql = require("mysql");
const settings = require("./settings");
let db;

function connectDatabase() {
  if (!db) {
    db = mysql.createConnection(settings);

    db.connect((err) => {
      if (!err) {
        console.log("Database is connected!");
      } else {
        console.log("Error connecting database!");
      }
    });
  }
  return db;
}

module.exports = connectDatabase();
