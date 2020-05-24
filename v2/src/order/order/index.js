const buildMakeOrder = require("./order");
const buildMakeOrderStatus = require("./order-status");
const buildMakeOrderedItem = require("./ordered-item");

const makeTimestamp = require("../../subentities/timestamp");
const makeUser = require("../../user/user");
const makeVendor = require("../../vendor/vendor");
const makeCrop = require("../../crop/crop");

const makeOrderStatus = buildMakeOrderStatus({});
const makeOrderedItem = buildMakeOrderedItem({ makeCrop });

const sanitize = (text) => text;

const makeOrder = buildMakeOrder({
  makeOrderedItem,
  makeTimestamp,
  makeUser,
  makeVendor,
  sanitize,
  makeOrderStatus,
});

module.exports = makeOrder;
