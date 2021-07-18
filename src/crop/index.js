const buildMakeCrop = require("./crop");
const makeCropType = require("../../crop-type/crop-type");
const makeVendor = require("../../vendor/vendor");
const sanitize = (text) => text;
const valid = (o) => true;

module.exports = makeCrop = buildMakeCrop({
  makeCropType,
  makeVendor,
  sanitize,
  valid,
});
