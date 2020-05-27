const makeCity = require("../../city");

module.exports = makeUpdateCity = ({ cityDb, filterUndefined }) => {
  return (updateCity = ({ id, ...changes }) => {
    if (!id) {
      throw new Error("City id must be provided.");
    }

    const existing = cityDb.findById({ id });
    if (!existing) {
      return {
        updatedCount: 0,
        message: "City doesn't exists with id provided.",
      };
    }
    const city = makeCity({ ...existing, ...changes });
    const state = city.getState();
    const options = filterUndefined({
      name: city.getName() || undefined,
      state_id: state && state.id ? state.id : undefined,
    });
    const updated = cityDb.updateById(options);

    return {
      updatedCount: 1,
      result: updated,
    };
  });
};
