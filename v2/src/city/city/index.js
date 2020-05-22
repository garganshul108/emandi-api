const buildMakeCity = require("./city");

const makeState = require("../../state/state");

const valid = (varible, criteria) => true;
const sanitize = (text) => text;

const makeCity = buildMakeCity({ makeState, sanitize, valid });

module.exports = makeCity;
