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
    const existing = await cropDb.findById({ id });
    if (!existing) {
      return deleteNothing();
    }
    await cropDb.removeById({ id });
    return {
      deleteCount: 1,
      message: "Crop deleted Successfully.",
    };
  });
};
