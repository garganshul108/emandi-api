let log = {};
log.interface = require("debug")("emandi:interface");
log.db = require("debug")("emandi:db");
log.service = require("debug")("emandi:service");
log.info = require("debug")("emandi:info");
log = Object.freeze({ ...log });
log.info("'log' attached to global space");
console.log("'log' attached to global space");
global.log = log;
