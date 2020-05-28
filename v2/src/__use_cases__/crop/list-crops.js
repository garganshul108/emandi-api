const makeCrop = require("../../crop");

module.exports = makeListCrops = ({ cropDb, filterUndefined }) => {
  return (listCrops = async (
    { id, vendor_id, crop_type_id, crop_class },
    transactionKey
  ) => {
    let fetched = undefined;
    if (id) {
      fetched = await cropDb.findById({ id }, transactionKey);
    } else {
      let options = filterUndefined({
        vendor_id: vendor_id || undefined,
        crop_type_id: crop_type_id || undefined,
        crop_class: crop_class || undefined,
      });
      fetched = await cropDb.findAll(options, transactionKey);
    }

    return {
      fetchedCount: 1,
      result: fetched,
    };
  });
};
