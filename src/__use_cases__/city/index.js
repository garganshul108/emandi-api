const makeAddCity = require("./add-city");
const makeListCities = require("./list-cities");
const makeRemoveCity = require("./remove-city");
const makeUpdateCity = require("./update-city");

const filterUndefined = require("../../../helper/util/filter-undefined");
const cityDb = require("../../__data_access__/city");

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
