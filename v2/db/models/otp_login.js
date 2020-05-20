const Sequelize = require("sequelize");
const pool = require("../pool");

const OTP_LOGIN = pool.define("OTP_LOGIN", {
  subscriber_id: { type: Sequelize.INTEGER },
  subscriber_type: { type: Sequelize.STRING(20) },
  contact: { type: Sequelize.BIGINT },
  otp: { type: Sequelize.INTEGER },
  reg_timestamp: { type: Sequelize.DATE },
});

module.exports = OTP_LOGIN;
