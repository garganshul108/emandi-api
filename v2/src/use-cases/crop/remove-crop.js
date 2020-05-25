const makeCrop = require("../crop");

module.exports = makeDeleteCrop = ({ cropDb }) => {
  const deleteNothing = () => {
    return {
      deleteCount: 0,
      message: "Nothing to delete.",
    };
  };
  return (deleteCrop = async ({ id }) => {
    if (!id) {
      throw new Error("Crop id must be provided.");
    }
    const toBeDeleted = makeCrop({ id });
    const existing = await cropDb.findById({ id });
    if (!existing) {
      return deleteNothing();
    }
    await cropDb.removeById({ id: toBeDeleted.getId() });
    return {
      deleteCount: 1,
      message: "Crop deleted Successfully.",
    };
  });
};
