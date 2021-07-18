const makeCityDb = require("./city-db");
const ORM = require("../../../db");
const arralyzeData = require("../../../db/util/arraylyze");
const extractData = require("../../../db/util/extract-data");

async function makeDb() {
  return ORM;
}

module.exports = cityDb = makeCityDb({ makeDb, arralyzeData, extractData });
