const makeState = require("../state");

module.exports = makeRemoveState = ({ stateDb }) => {
  const doesNotExist = () => {
    return {
      deletedCount: 0,
      message: "State doesn't exists",
    };
  };
  return (removeState = async ({ id }) => {
    if (!id) {
      throw new Error("State id must be provided.");
    }

    const toBeDeleted = makeState({ id });

    const existing = stateDb.findById({ id: toBeDeleted.id });
    if (!existing) {
      return doesNotExist();
    }

    await stateDb.removeById({ id: toBeDeleted.getId() });
    return {
      deletedCount: 1,
      message: "State deleted successfully",
    };
  });
};
