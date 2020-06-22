const makeCrop = require("../../crop");

module.exports = makeUpdateCrop = ({ dirtyCache, cropDb, filterUndefined }) => {
  return (updateCrop = async ({ id, changeInCropQty, ...changes }) => {
    if (!id) {
      throw new Error("Crop id must be provided.");
    }

    if (dirtyCache.find({ id })) {
      return {
        updatedCount: 0,
        message: "Cannot be updated at the moment, under processing.",
      };
    }

    if (!dirtyCache.add({ id })) {
      return {
        updatedCount: 0,
        serverError: 1,
        message: "Internal Server Error. Not able to dirty cache the crop id",
      };
    }

    const existing = await cropDb.findbyId({ id });
    if (!existing) {
      dirtyCache.remove({ id });
      return {
        updateCount: 0,
        message: "No crop with provided id exists.",
      };
    }

    const crop = makeCrop({ ...existing, ...changes });

    if (changeInCropQty) {
      crop.addCropQty(changeInCropQty);
    }

    const updated = await cropDb.updateById({
      id: crop.getId(),
      crop_name: crop.getName(),
      description: crop.getDescription(),
      crop_qty: crop.getCropQty(),
      crop_type_id: crop.getCropType().getId(),
      crop_price: crop.getCropPrice(),
    });

    dirtyCache.remove({ id });
    return {
      updateCount: 1,
      result: updated,
    };
  });
};
