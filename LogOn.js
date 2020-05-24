let logOn = {};
logOn.api = require("debug")("emandi:api");
logOn.db = require("debug")("emandi:db");
logOn.core = require("debug")("emandi:core");
logOn = Object.freeze({ ...logOn });
console.log("'logOn' attached to global space");
global.logOn = logOn;
