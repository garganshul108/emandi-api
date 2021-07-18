module.exports = buildMakeOrderedItem = ({ updateCrop }) => {
  return (makeOrderedItem = ({ crop, item_qty }) => {
    if (!crop) {
      throw new Error("Crop must be provided.");
    }

    if (item_qty && !valid(item_qty, { type: "number" })) {
      throw new Error(`Invaid item qty provided for crop id = ${crop.getId()}`);
    }

    if (item_qty <= 0) {
      throw new Error("Item qty must be positive.");
    }

    if (!crop.crop_price) {
      throw new Error(
        "Crop price must be provided for item_freezed_cost calculation"
      );
    }

    const itemFreezedCost = crop.crop_price() * item_qty;

    return Object.freeze({
      getItemFreezedCost: () => itemFreezedCost,
      getCrop: () => crop,
      getItemQty: () => item_qty,
      dispatch: async (transactionKey) => {
        await updateCrop(
          { id: crop.id, changeInCropQty: -1 * item.getItemQty() },
          transactionKey
        );
      },
      cancelDispatch: async (transactionKey) => {
        await updateCrop(
          { id: crop.id, changeInCropQty: item.getItemQty() },
          transactionKey
        );
      },
    });
  });
};
