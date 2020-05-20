const Sequelize = require("sequelize");
const pool = require("../pool");

const OTP_SIGNUP = pool.define("OTP_SIGNUP", {
  subscriber_type: {
    type: Sequelize.STRING,
  },
  contact: {
    type: Sequelize.BIGINT,
  },
  otp: {
    type: Sequelize.INTEGER,
  },
  reg_timestamp: {
    type: Sequelize.DATE,
  },
});

module.exports = OTP_SIGNUP;
