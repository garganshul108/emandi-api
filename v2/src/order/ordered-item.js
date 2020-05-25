module.exports = buildMakeOrderedItem = ({ makeOrder, makeCrop }) => {
  return (makeOrderedItem = ({ crop, item_qty }) => {
    if (crop) {
      crop = makeCrop(crop);
    }

    if (item_qty && !valid(item_qty, { type: "number" })) {
      throw new Error(`Invaid item qty provided for crop id = ${crop.getId()}`);
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
    });
  });
};
