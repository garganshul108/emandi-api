const makeCity = require("../city");
module.exports = makeAddCity = ({ cityDb }) => {
  return (addCity = async ({ name, state }) => {
    if (!name) {
      throw new Error("City name must be provided.");
    }
    if (!state || !state.id) {
      throw new Error("State id must be provided.");
    }

    const city = makeCity({ name, state });
    const stateOfCity = city.getState();
    const inserted = await cityDb.insert({
      name: city.getName(),
      state_id: stateOfCity.getId(),
    });

    return {
      insertCount: 1,
      result: inserted,
    };
  });
};
