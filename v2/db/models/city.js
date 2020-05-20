const Sequelize = require("sequelize");
const pool = require("../pool");

const CITY = pool.define("CITY", {
  city_id: { type: Sequelize.SMALLINT },
  name: { type: Sequelize.STRING(25) },
  state_id: { type: Sequelize.TINYINT },
});

module.exports = CITY;
