const makeCrop = require("../../crop");

module.exports = makeAddCrop = ({ cropDb, filterUndefined }) => {
  return (addCrop = async (cropInfo) => {
    const newCrop = makeCrop(cropInfo);
    const inserted = await cropDb.insert({
      crop_name: newCrop.getName(),
      description: newCrop.getDescription(),
      crop_type_id: newCrop.getCropType().getId(),
      vendor_id: newCrop.getVendor().getId(),
      crop_qty: newCrop.getCropQty(),
      crop_price: newCrop.getCropPrice(),
    });
    return {
      insertedCount: 1,
      result: inserted,
    };
  });
};
