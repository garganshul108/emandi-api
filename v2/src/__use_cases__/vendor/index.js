const makeAddVendor = require("./add-vendor");
const makeEditVendor = require("./update-vendor");
const makeRemoveVendor = require("./remove-vendor");
const makeListVendors = require("./list-vendors");
const vendorDb = require("../../__data_access__/vendor");

const addVendor = makeAddVendor({ vendorDb });
const editVendor = makeEditVendor({ vendorDb });
const listVendors = makeListVendors({ vendorDb });
const removeVendor = makeRemoveVendor({ vendorDb });

const vendorService = Object.freeze({
  addVendor,
  editVendor,
  listVendors,
  removeVendor,
});

module.exports = vendorService;
