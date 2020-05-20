const Sequelize = require("sequelize");
const pool = require("../pool");

const ORDERS = pool.define("ORDERS", {
  order_id: { type: Sequelize.INTEGER },
  issue_timestamp: { type: Sequelize.DATE },
  user_id: { type: Sequelize.INTEGER },
  delivery_address: { type: Sequelize.STRING(300) },
  vendor_id: { type: Sequelize.INTEGER },
  order_status: { type: Sequelize.STRING(20) },
});

module.exports = ORDERS;
