const makeCity = require("../city");

module.exports = makeUpdateCity = ({ cityDb, filterUndefined }) => {
  return (updateCity = ({ id, ...cityInfo }) => {
    if (!id) {
      throw new Error("City id must be provided.");
    }
    const city = makeCity({ id, ...cityInfo });
    const state = city.getState();
    const options = {
      name: city.getName() || undefined,
      state_id: state && state.id ? state.id : undefined,
    };
    const updated = cityDb.updateById(options);

    return {
      updatedCount: 1,
      result: updated,
    };
  });
};
