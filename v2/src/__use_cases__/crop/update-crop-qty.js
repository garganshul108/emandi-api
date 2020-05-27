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

    let crop = makeCrop({ id });
    let updated = await updateCropQtyById({
      id: crop.getid(),
      changeInCropQty,
    });
    return {
      updatedCount: 1,
      result: updated,
    };
  });
};
