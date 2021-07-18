const config = require("config");

module.exports = {
  connectionLimt: 1,
  host: config.get("db-host"),
  user: config.get("db-user"),
  password: config.get("db-password"),
  database: config.get("db-name"),
};
