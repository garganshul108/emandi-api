const makeAddCity = require("./add-city");
const makeListCities = require("./list-cities");
const makeRemoveCity = require("./remove-city");
const makeUpdateCity = require("./update-city");

const filterUndefined = require("../../../util/filter-undefined.js");
const cityDb = require("../data-access");

const addCity = makeAddCity({ cityDb });
const listCitites = makeListCities({ cityDb, filterUndefined });
const removeCity = makeRemoveCity({ cityDb });
const updateCity = makeUpdateCity({ cityDb, filterUndefined });

module.exports = {
  addCity,
  listCitites,
  removeCity,
  updateCity,
};
