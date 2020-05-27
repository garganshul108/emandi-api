const makeState = require("../../state");
module.exports = makeAddState = ({ stateDb }) => {
  return (addCity = async ({ name }) => {
    if (!name) {
      throw new Error("State name must be provided.");
    }

    const state = makeState({ name });
    const inserted = await stateDb.insert({
      name: state.getName(),
    });

    return {
      insertCount: 1,
      result: inserted,
    };
  });
};
