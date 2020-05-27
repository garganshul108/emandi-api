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

    const existing = cityDb.findById({ id });
    if (!existing) {
      return doesNotExist();
    }

    await cityDb.removeById({ id });
    return {
      deletedCount: 1,
      message: "City deleted successfully",
    };
  });
};
