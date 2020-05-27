const makeCity = require("../../city");

module.exports = makeRemoveCity = ({ cityDb }) => {
  const doesNotExist = () => {
    return {
      deletedCount: 0,
      message: "City doesn't exists",
    };
  };
  return (removeCity = async ({ id }) => {
    if (!id) {
      throw new Error("City id must be provided.");
    }

    const toBeDeleted = makeCity({ id });

    const existing = cityDb.findById({ id: toBeDeleted.id });
    if (!existing) {
      return doesNotExist();
    }

    await cityDb.removeById({ id: toBeDeleted.getId() });
    return {
      deletedCount: 1,
      message: "City deleted successfully",
    };
  });
};
