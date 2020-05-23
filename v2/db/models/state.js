const Sequelize = require("sequelize");
const pool = require("../pool");

const STATE = pool.define("STATE", {
  name: { type: Sequelize.STRING(25) },
  state_id: { type: Sequelize.TINYINT, primaryKey: true },
});

module.exports = STATE;
