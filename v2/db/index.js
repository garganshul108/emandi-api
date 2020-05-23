const ADMIN = require("./models/admin");
const CITY = require("./models/city");
const CROP = require("./models/crop");
const CROP_TYPE = require("./models/crop_type");
const ORDERED_ITEM = require("./models/ordered_item");
const ORDERS = require("./models/orders");
const OTP_LOGIN = require("./models/otp_login");
const OTP_SIGNUP = require("./models/otp_signup");
const STATE = require("./models/state");
const USER = require("./models/user");
const VENDOR = require("./models/vendor");
const pool = require("./pool");
const Sequelize = require("sequelize");

// state and city
STATE.hasMany(CITY, {
  foreignKey: "state_id",
  onDelete: "CASCADE",
});

CITY.belongsTo(STATE, {
  foreignKey: "state_id",
  onDelete: "CASCADE",
});

// state and user
STATE.hasMany(USER, {
  foreignKey: "state_id",
  onDelete: "SET NULL",
});

USER.belongsTo(STATE, {
  foreignKey: "state_id",
  onDelete: "SET NULL",
});

// state and vendor
STATE.hasMany(VENDOR, {
  foreignKey: "state_id",
  onDelete: "SET NULL",
});

VENDOR.belongsTo(STATE, {
  foreignKey: "state_id",
  onDelete: "SET NULL",
});

// city and vendor
CITY.hasMany(VENDOR, {
  foreignKey: "city_id",
  onDelete: "SET NULL",
});

VENDOR.belongsTo(CITY, {
  foreignKey: "city_id",
  onDelete: "SET NULL",
});

// city and vendor
CITY.hasMany(USER, {
  foreignKey: "city_id",
  onDelete: "SET NULL",
});

USER.belongsTo(CITY, {
  foreignKey: "city_id",
  onDelete: "SET NULL",
});

//crop and crop type
CROP_TYPE.hasMany(CROP, {
  foreignKey: "crop_type_id",
  onDelete: "SET NULL",
});

CROP.belongsTo(CROP_TYPE, {
  foreignKey: "crop_type_id",
  onDelete: "SET NULL",
});

//orders and ordered items
ORDERS.hasMany(ORDERED_ITEM, {
  foreignKey: "order_id",
  onDelete: "CASCADE",
});

ORDERED_ITEM.belongsTo(ORDERS, {
  foreignKey: "order_id",
  onDelete: "CASCADE",
});

//vendor and crop
VENDOR.hasMany(CROP, {
  foreignKey: "vendor_id",
  onDelete: "CASCADE",
});

CROP.belongsTo(VENDOR, {
  foreignKey: "vendor_id",
  onDelete: "CASCADE",
});

// user and order

USER.hasMany(ORDERS, {
  foreignKey: "user_id",
  onDelete: "SET NULL",
});

ORDERS.belongsTo(USER, {
  foreignKey: "user_id",
  onDelete: "SET NULL",
});

// vendor and order

VENDOR.hasMany(ORDERS, {
  foreignKey: "user_id",
  onDelete: "SET NULL",
});

ORDERS.belongsTo(VENDOR, {
  foreignKey: "user_id",
  onDelete: "SET NULL",
});

module.exports = Object.freeze({
  ADMIN,
  CITY,
  CROP,
  CROP_TYPE,
  ORDERED_ITEM,
  ORDERS,
  OTP_LOGIN,
  OTP_SIGNUP,
  STATE,
  USER,
  VENDOR,
  ORMPool: pool,
  ORMClass: Sequelize,
});
