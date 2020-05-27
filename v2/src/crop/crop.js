module.exports = buildMakeCrop = ({ sanitize, valid }) => {
  return (makeCrop = ({
    id,
    vendor,
    crop_qty,
    crop_price,
    crop_name,
    cropType,
    description,
  }) => {
    if (!vendor || !vendor.id) {
      throw new Error("Vendor id must be provided.");
    }

    if (!cropType || !cropType.id) {
      throw new Error("Vendor id must be provided.");
    }

    if (!crop_qty) {
      throw new Error("Crop qty must be provided.");
    }

    if (!crop_price) {
      throw new Error("Crop price must be provided.");
    }

    if (crop_qty <= 0) {
      throw new Error("Crop qty must be greater than 0.");
    }

    if (crop_price <= 0) {
      throw new Error("Crop price must be positive.");
    }

    if (crop_name) {
      crop_name = sanitize(crop_name);
      if (!valid(crop_name, { type: "string" })) {
        throw new Error("Invalid crop name provided.");
      }
    }

    if (description) {
      description = sanitize(description);
    }

    return Object.freeze({
      getId: () => id,
      getVendor: () => Object.freeze({ getId: () => vendor.id }),
      getCropQty: () => crop_qty,
      getCropPrice: () => crop_price,
      getCropName: () => crop_name,
      getCropType: () => Object.freeze({ getId: () => cropType.id }),
      getDescription: () => description,
      addCropQty: (q) => {
        if (crop_qty + q < 0) {
          throw new Error("Insufficient crop qty.");
        }
        crop_qty += q;
      },
    });
  });
};
