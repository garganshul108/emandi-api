const Sequelize = require("sequelize");
const sequelize = require("../pool");

const ADMIN = sequelize.define("ADMIN", {
  admin_name: { type: Sequelize.STRING(50), primaryKey: true },
  password: { type: Sequelize.STRING(150) },
});

module.exports = ADMIN;
