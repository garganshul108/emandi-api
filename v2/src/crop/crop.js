module.exports = buildMakeCrop = ({
  makeVendor,
  makeCropType,
  sanitize,
  valid,
}) => {
  return (makeCrop = ({
    id,
    vendor,
    crop_qty,
    crop_price,
    crop_name,
    cropType,
    description,
  }) => {
    if (vendor) {
      vendor = makeVendor(vendor);
    }

    if (cropType) {
      cropType = makeCropType(cropType);
    }

    return Object.freeze({
      getId: () => id,
      getVendor: () => vendor,
      getCropQty: () => crop_qty,
      getCropPrice: () => crop_price,
      getCropName: () => crop_name,
      getCropType: () => cropType,
      getDescription: () => description,
    });
  });
};
