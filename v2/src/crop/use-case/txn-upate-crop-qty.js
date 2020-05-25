const makeCrop = require("../crop");

module.exports = makeTxnUpdateCropQty = ({ cropDb }) => {
  return (txnUpdateCropQty = async ({ changeInCropQty, id }, { _txn }) => {
    if (!id) {
      throw new Error("Crop id must be specified.");
    }

    if (!_txn) {
      throw new Error(
        "Transaction component must be specified, Internal Server Error."
      );
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
    let updated = await txnUpdateCropQtyById({
      id: crop.getid(),
      changeInCropQty,
      _txn,
    });
    return {
      updatedCount: 1,
      result: updated,
    };
  });
};
