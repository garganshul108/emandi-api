const Sequelize = require("sequelize");
const sequelize = require("../pool");

const USER = sequelize.define("USER", {
  user_id: { type: Sequelize.INTEGER, primaryKey: true },
  contact: { type: Sequelize.BIGINT(20), allowNull: false },
  type: { type: Sequelize.STRING(25) },
  name: { type: Sequelize.STRING(50) },
  state_id: { type: Sequelize.TINYINT },
  city_id: { type: Sequelize.SMALLINT },
  pin_code: { type: Sequelize.INTEGER },
  address: { type: Sequelize.STRING(1000) },
  profile_picture: { type: Sequelize.STRING(1000) },
  reg_timestamp: { type: Sequelize.DATE },
  device_fcm_token: { type: Sequelize.STRING(500) },
  orders_issued: { type: Sequelize.INTEGER },
  orders_cancelled_by_user: { type: Sequelize.INTEGER },
  order_domino_number: { type: Sequelize.TINYINT },
  defaulter_status: { type: Sequelize.STRING(30) },
  defaulter_timestamp: { type: Sequelize.DATE },
  defaulter_period: { type: Sequelize.DATE },
});

module.exports = USER;
