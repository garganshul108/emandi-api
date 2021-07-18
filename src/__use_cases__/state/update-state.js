const makeState = require("../../state");

module.exports = makeUpdateState = ({ stateDb, filterUndefined }) => {
  return (updateState = async ({ id, ...changes }) => {
    if (!id) {
      throw new Error("State id must be provided.");
    }
    const existing = await stateDb.findById({ id });
    if (!existing) {
      return {
        updatedCount: 0,
        message: "State with provided id doesn't exists.",
      };
    }
    const state = makeState({ ...existing, ...changes });

    const updated = stateDb.updateById(state);

    return {
      updatedCount: 1,
      result: updated,
    };
  });
};
