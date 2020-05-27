module.exports = buildMakeOrderedItem = ({ makeCrop }) => {
  return (makeOrderedItem = ({ crop, item_qty }) => {
    if (!crop) {
      throw new Error("Crop must be provided.");
    }

    crop = makeCrop(crop);

    if (item_qty && !valid(item_qty, { type: "number" })) {
      throw new Error(`Invaid item qty provided for crop id = ${crop.getId()}`);
    }

    if (item_qty <= 0) {
      throw new Error("Item qty must be positive.");
    }

    if (!crop.getCropPrice()) {
      throw new Error(
        "Crop price must be provided for item_freezed_cost calculation"
      );
    }

    const itemFreezedCost = crop.getCropPrice() * item_qty;

    return Object.freeze({
      getItemFreezedCost: () => itemFreezedCost,
      getCrop: () => crop,
      getItemQty: () => item_qty,
      dispatch: () => {
        crop.addCropQty(-item_qty);
      },
      cancelDispatch: () => {
        crop.addCropQty(item_qty);
      },
    });
  });
};
