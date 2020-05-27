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

    const existing = stateDb.findById({ id });
    if (!existing) {
      return doesNotExist();
    }

    await stateDb.removeById({ id });
    return {
      deletedCount: 1,
      message: "State deleted successfully",
    };
  });
};
