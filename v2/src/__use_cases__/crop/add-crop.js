const makeCrop = require("../../crop");

module.exports = makeAddCrop = ({ cropDb, filterUndefined }) => {
  return (addCrop = async (cropInfo) => {
    let {
      cropType,
      vendor,
      crop_qty,
      crop_price,
      crop_name,
      description,
    } = cropInfo;

    if (!crop_qty) {
      throw new Error("Crop qty must be provided.");
    }

    if (!crop_price) {
      throw new Error("Crop price must be provided.");
    }

    if (!cropType || !cropType.id) {
      throw new Error("Crop type id must be provided.");
    }

    if (!vendor || !vendor.id) {
      throw new Error("Vendor id must be provided.");
    }

    const newCrop = makeCrop({ ...cropInfo });
    let options = {
      crop_name: newCrop.getName(),
      description: newCrop.getDescription(),
      crop_type_id: newCrop.getCropType().getId(),
      vendor_id: newCrop.getVendor().getId(),
      crop_qty: newCrop.getCropQty(),
      crop_price: newCrop.getCropPrice(),
    };
    options = filterUndefined(options);
    const inserted = await cropDb.insert(options);
    return {
      insertedCount: 1,
      result: inserted,
    };
  });
};
