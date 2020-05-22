const buildMakeState = require("./state");

const valid = (varible, criteria) => true;
const sanitize = (text) => text;

const makeState = buildMakeState({ valid, sanitize });

module.exports = makeState;
