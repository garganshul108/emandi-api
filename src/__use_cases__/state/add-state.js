const makeState = require("../../state");
module.exports = makeAddState = ({ stateDb }) => {
  return (addState = async ({ name }) => {
    const state = makeState({ name });
    const existing = stateDb.findByName({ name: state.getName() });
    if (existing) {
      return {
        insertedCount: 0,
        result: existing,
      };
    }

    const inserted = await stateDb.insert({
      name: state.getName(),
    });

    return {
      insertedCount: 1,
      result: inserted,
    };
  });
};
