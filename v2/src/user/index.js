const buildMakeUser = require("./user");
const makeCity = require("../../city/city");
const makeState = require("../../state/state");
const makeURL = require("../../subentities/url");
const makeTimestamp = require("../../subentities/timestamp");
const makeDeviceFCMToken = require("../../subentities/deviceFCMToken");
const makePinCode = require("../../subentities/pinCode");

const valid = (varible, criteria) => true;
const sanitize = (text) => text;

const makeUser = buildMakeUser({
  makeCity,
  sanitize,
  valid,
  makeState,
  makeURL,
  makeTimestamp,
  makePinCode,
  makeDeviceFCMToken,
});

module.exports = makeUser;
