module.exports = buildMakeOrderedItem = ({}) => {
  return (makeOrderedItem = ({ crop, itemQty }) => {
    if (!crop) {
      throw new Error("Crop must be provided.");
    }

    if (
      itemQty === null ||
      itemQty === undefined ||
      itemQty === "" ||
      itemQty === NaN
    ) {
      throw new Error("Item qty must be provided.");
    }

    if (!valid(itemQty, { type: "number" })) {
      throw new Error(`Invaid item qty provided for crop id = ${crop.getId()}`);
    }

    if (itemQty <= 0) {
      throw new Error("Item qty must be positive.");
    }

    if (!crop.price) {
      throw new Error(
        "Crop price must be provided for item_freezed_cost calculation"
      );
    }

    const itemFreezedCost = crop.price() * item_qty;

    return Object.freeze({
      getItemFreezedCost: () => itemFreezedCost,
      getCrop: () => crop,
      getItemQty: () => itemQty,
    });
  });
};

// removed the dispatch and cancelDispatch methods
