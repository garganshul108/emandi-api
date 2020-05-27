const makeCity = require("../../city");
module.exports = makeAddCity = ({ cityDb }) => {
  return (addCity = async ({ name, state }) => {
    const city = makeCity({ name, state });
    const stateOfCity = city.getState();

    const existing = cityDb.findByNameAndStateId({
      name,
      state_id: stateOfCity.getId(),
    });

    if (existing) {
      return {
        insertedCount: 0,
        result: existing,
        message: "City already exists",
      };
    }

    const inserted = await cityDb.insert({
      name: city.getName(),
      state_id: stateOfCity.getId(),
    });

    return {
      insertedCount: 1,
      result: inserted,
    };
  });
};
