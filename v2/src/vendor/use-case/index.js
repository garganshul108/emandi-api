const makeAddVendor = require("./add-vendor");
const makeEditVendor = require("./edit-vendor");
const makeRemoveVendor = require("./remove-vendor");
const makeListVendors = require("./list-vendors");
const vendorDb = require("../data-access");

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

export default vendorService;
export { addVendor, editVendor, listVendors, removeVendor };
