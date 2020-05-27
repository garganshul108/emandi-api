const makeCrop = require("../../crop");

module.exports = makeListCrops = ({ cropDb, filterUndefined }) => {
  return (listCrops = async (cropInfo) => {
    if (!cropInfo) {
      fetched = await cropDb.findAll();
    } else {
      let crop = makeCrop(cropInfo);
      let options = filterUndefined({
        id: crop.getId(),
        vendor_id: crop.getVendor().getId(),
        crop_type_id: crop.getCropType().getId(),
        crop_name: crop.getCropName(),
        crop_qty: crop.getCropQty(),
        crop_price: crop.getCropPrice(),
      });
      fetched = cropDb.findAll(options);
    }

    return {
      fetchedCount: fetched.length,
      result: fetched,
    };
  });
};
