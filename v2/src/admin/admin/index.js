const buildMakeAdmin = require("./admin");

const sanitize = (text) => text;

const makeAdmin = buildMakeAdmin({ sanitize });

module.exports = makeAdmin;
