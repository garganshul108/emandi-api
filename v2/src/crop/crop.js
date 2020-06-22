module.exports = buildMakeCrop = ({ sanitize, valid }) => {
  return (makeCrop = ({
    id,
    vendorId,
    qty,
    price,
    name,
    cropTypeId,
    description,
  }) => {
    if (!vendorId) {
      throw new Error("Vendor id must be provided.");
    }

    if (!cropTypeId) {
      throw new Error("Vendor id must be provided.");
    }

    if (!qty) {
      throw new Error("Crop qty must be provided.");
    }

    if (!price) {
      throw new Error("Crop price must be provided.");
    }

    if (qty <= 0) {
      throw new Error("Crop qty must be greater than 0.");
    }

    if (price <= 0) {
      throw new Error("Crop price must be positive.");
    }

    if (name) {
      name = sanitize(name);
      if (!valid(name, { type: "string" })) {
        throw new Error("Invalid crop name provided.");
      }
    }

    if (description) {
      description = sanitize(description);
    }

    return Object.freeze({
      getId: () => id,
      getVendorId: () => vendorId,
      getQty: () => qty,
      getPrice: () => price,
      getName: () => name,
      getCropTypeId: () => cropTypeId,
      getDescription: () => description,
      addQty: (q) => {
        if (crop_qty + q < 0) {
          throw new Error("Insufficient crop qty.");
        }
        crop_qty += q;
      },
    });
  });
};
