const Sequelize = require("sequelize");
const pool = require("../pool");

const CROP_TYPE = pool.define("CROP_TYPE", {
  crop_type_id: { type: Sequelize.INTEGER, primaryKey: true },
  crop_type_name: { type: Sequelize.STRING(200) },
  crop_class: { type: Sequelize.STRING(200) },
  crop_type_image: { type: Sequelize.STRING(500) },
});

module.exports = CROP_TYPE;
