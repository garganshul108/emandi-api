const makeCrop = require("../../crop");

module.exports = makeUpdateCrop = ({ cropDb, filterUndefined }) => {
  return (updateCrop = async ({ id, changeInCropQty, ...changes }) => {
    if (!id) {
      throw new Error("Crop id must be provided.");
    }

    const existing = cropDb.findbyId({ id });
    if (!existing) {
      return {
        updateCount: 0,
        message: "No crop with provided id exists.",
      };
    }

    const crop = makeCrop({ ...existing, ...changes });

    if (changeInCropQty) {
      crop.addCropQty(changeInCropQty);
    }

    const updated = cropDb.updateById({
      id: crop.getId(),
      crop_name: crop.getName(),
      description: crop.getDescription(),
      crop_qty: crop.getCropQty(),
      crop_type_id: crop.getCropType().getId(),
      crop_price: crop.getCropPrice(),
    });

    return {
      updateCount: 1,
      result: updated,
    };
  });
};
