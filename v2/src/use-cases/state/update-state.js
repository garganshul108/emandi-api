const makeState = require("../state");

module.exports = makeUpdateState = ({ stateDb, filterUndefined }) => {
  return (updateState = ({ id, ...stateInfo }) => {
    if (!id) {
      throw new Error("State id must be provided.");
    }
    const state = makeState({ id, ...stateInfo });
    const state = state.getState();
    const options = filterUndefined({
      name: state.getName() || undefined,
    });
    const updated = stateDb.updateById(options);

    return {
      updatedCount: 1,
      result: updated,
    };
  });
};
