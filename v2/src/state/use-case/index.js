const makeAddState = require("./add-state");
const makeListStates = require("./list-states");
const makeRemoveState = require("./remove-state");
const makeUpdateState = require("./update-state");

const filterUndefined = require("../../../util/filter-undefined.js");
const stateDb = require("../data-access");

const addState = makeAddState({ stateDb });
const listStates = makeListStates({ stateDb, filterUndefined });
const removeState = makeRemoveState({ stateDb });
const updateState = makeUpdateState({ stateDb, filterUndefined });

module.exports = {
  addState,
  listStates,
  removeState,
  updateState,
};
