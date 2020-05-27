const makeCrop = require("../../crop");

module.exports = makeUpdateCrop = ({ cropDb, filterUndefined }) => {
  return (updateCrop = async ({ id, ...cropInfo }) => {
    if (!id) {
      throw new Error("Crop id must be provided.");
    }

    let crop = makeCrop(cropInfo);

    let options = filterUndefined({
      crop_type_id: crop.getCropType().getId(),
      crop_name: crop.getCropName(),
      crop_price: crop.getCropPrice(),
      id: crop.getId(),
    });

    const updated = await cropDb.updateById(options);

    return {
      updateCount: 1,
      result: updated,
    };
  });
};
