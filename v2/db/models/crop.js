const Sequelize = require("sequelize");
const pool = require("../pool");

const CROP = pool.define("CROP", {
  crop_id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  vendor_id: { type: Sequelize.INTEGER },
  crop_qty: {
    type: Sequelize.DECIMAL(10, 2),
    validate: {
      min: 0,
    },
  },
  crop_price: {
    type: Sequelize.DECIMAL(10, 2),
  },
  crop_name: { type: Sequelize.STRING(200) },
  crop_type_id: { type: Sequelize.INTEGER },
  packed_timestamp: { type: Sequelize.DATE },
  exp_timestamp: { type: Sequelize.DATE },
  description: { type: Sequelize.STRING(200) },
});

module.exports = CROP;
