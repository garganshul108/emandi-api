const Sequelize = require("sequelize");
const pool = require("../pool");

const ORDERED_ITEM = pool.define("ORDERED_ITEM", {
  order_id: { type: Sequelize.INTEGER },
  crop_id: { type: Sequelize.INTEGER },
  item_qty: { type: Sequelize.DECIMAL(10, 2) },
  item_freezed_cost: { type: Sequelize.DECIMAL(10, 2) },
});

module.exports = ORDERED_ITEM;
