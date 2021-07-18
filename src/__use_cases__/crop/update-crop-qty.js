//deprecated

const makeCrop = require("../../crop");

module.exports = makeUpdateCropQty = ({ cropDb }) => {
  return (UpdateCropQty = async ({ changeInCropQty, id }) => {
    if (!id) {
      throw new Error("Crop id must be specified.");
    }

    if (changeInCropQty === null || changeInCropQty === undefined) {
      throw new Error(
        "Crop change in qty must be specified (or must not be 0)."
      );
    }

    if (typeof changeInCropQty !== "number") {
      throw new Error("Crop change in qty must be a number");
    }

    const existing = cropDb.findById({ id });
    if (!existing) {
      return {
        updatedCount: 0,
        message: "No crop exists with provided id.",
      };
    }

    let crop = makeCrop({ ...existing });
    crop.addCropQty(changeInCropQty);

    return {
      updatedCount: 1,
      result: updated,
    };
  });
};
