// const sanitizeHtml = require("sanitize-html");
const buildMakeVendor = require("./vendor");
const makeAddress = require("../../subentities/address");
const makeDeviceFCMToken = require("../../subentities/deviceFCMToken");
const makeTimestamp = require("../../subentities/timestamp");
const makeProfilePicture = require("../../subentities/profilePicture");
const makeId = require("../../subentities/id");
const sanitize = (text) => {
  // TODO: allow more coding embeds
  return text;
  //   return sanitizeHtml(text, {
  //     allowedIframeHostnames: ["codesandbox.io", "repl.it"],
  //   });
};

const isValid = (variable, options) => {
  if (variable) return true;
};

const makeVendor = buildMakeVendor({
  isValid,
  makeAddress,
  makeDeviceFCMToken,
  makeTimestamp,
  makeProfilePicture,
  makeId,
  sanitize,
});

module.exports = makeVendor;
