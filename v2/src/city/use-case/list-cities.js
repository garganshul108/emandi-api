const makeCity = require("../city");
module.exports = makeListCities = ({ cityDb, filterUndefined }) => {
  return (listCities = (options) => {
    if (!options) {
      return cityDb.findAll();
    }
    const city = makeCity(options);
    options = {
      name: city.getName() || undefined,
      id: city.getId() || undefined,
      state_id: (city.getState() && city.getState().getId()) || undefined,
    };
    options = filterUndefined(options);
    let result = cityDb.findAll(options);
    return {
      foundCount: result.length,
      result,
    };
  });
};
