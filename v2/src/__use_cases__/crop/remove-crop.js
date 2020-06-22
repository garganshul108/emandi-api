module.exports = makeDeleteCrop = ({ dirtyCache, cropDb }) => {
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

    if (dirtyCache.find({ id })) {
      return {
        deleteCount: 0,
        message: "Cannot be deleted, under processing.",
      };
    }

    if (!dirtyCache.add({ id })) {
      return {
        deletedCount: 0,
        serverError: 1,
        message:
          "Internal Server Error. Crop id cannot be added to the dirty cache.",
      };
    }

    const existing = await cropDb.findById({ id });
    if (!existing) {
      if (!dirtyCache.remove({ id })) {
        return {
          deletedCount: 0,
          serverError: 1,
          message:
            "Internal Server Error. Crop id cannot be removed from the dirty cache.",
        };
      }
      return deleteNothing();
    }

    await cropDb.removeById({ id });
    if (!dirtyCache.remove({ id })) {
      return {
        deletedCount: 0,
        serverError: 1,
        message:
          "Internal Server Error. Crop id cannot be removed from the dirty cache.",
      };
    }

    return {
      deleteCount: 1,
      message: "Crop deleted Successfully.",
    };
  });
};
