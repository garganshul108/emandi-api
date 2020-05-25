const makeCrop = require("../crop");

module.exports = makeTxnListCrops = ({ cropDb, filterUndefined }) => {
  return (txnListCrops = async (cropInfo, { _txn }) => {
    if (!_txn) {
      throw new Error(
        "Transaction object must be provided, Internal Server Error"
      );
    }

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
        _txn,
      });
      fetched = cropDb.txnFindAll(options);
    }

    return {
      fetchedCount: fetched.length,
      result: fetched,
    };
  });
};
