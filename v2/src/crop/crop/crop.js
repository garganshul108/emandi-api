module.exports = buildMakeCrop = ({
  makeVendor,
  makeCropType,
  sanitize,
  valid,
}) => {
  return (makeCrop = ({
    id,
    vendor_id,
    crop_qty,
    crop_price,
    crop_name,
    crop_type_id,
    description,
  }) => {
    let vendor = undefined;
    if (vendor_id) {
      vendor = makeVendor({ id: vendor_id });
    }

    let cropType = undefined;
    if (crop_type_id) {
      cropType = makeCropType({ id: crop_type_id });
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
