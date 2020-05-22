const buildMakeVendor = require("./vendor");
const makeCity = require("../../city/city");
const makeState = require("../../state/state");
const makeURL = require("../../subentities/url");
const makeTimestamp = require("../../subentities/timestamp");
const makeDeviceFCMToken = require("../../subentities/deviceFCMToken");

const valid = (varible, criteria) => true;
const sanitize = (text) => text;

const makeVendor = buildMakeVendor({
  makeDeviceFCMToken,
  makeCity,
  sanitize,
  valid,
  makeState,
  makeURL,
  makeTimestamp,
});

module.exports = makeVendor;
