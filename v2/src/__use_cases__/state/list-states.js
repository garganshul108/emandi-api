const makeState = require("../../state");
module.exports = makeListStates = ({ stateDb, filterUndefined }) => {
  return (listStates = async (options) => {
    let fetched = undefined;
    if (!options) {
      fetched = stateDb.findAll();
    }
    const state = makeCity(options);
    options = {
      name: state.getName() || undefined,
      id: state.getId() || undefined,
    };
    options = filterUndefined(options);
    let fetched = await stateDb.findAll(options);
    return {
      foundCount: result.length,
      result: fetched,
    };
  });
};
