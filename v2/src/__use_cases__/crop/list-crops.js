const makeCrop = require("../../crop");

module.exports = makeListCrops = ({ cropDb, filterUndefined }) => {
  return (listCrops = async ({ id, vendor_id, crop_type_id, crop_class }) => {
    let fetched = undefined;
    if (id) {
      fetched = await cropDb.findById({ id });
    } else {
      let options = filterUndefined({
        vendor_id: vendor_id || undefined,
        crop_type_id: crop_type_id || undefined,
        crop_class: crop_class || undefined,
      });
      fetched = await cropDb.findAll(options);
    }

    return {
      fetchedCount: 1,
      result: fetched,
    };
  });
};
