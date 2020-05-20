const {
  addVendor,
  editVendor,
  listVendors,
  removeVendor,
} = require("../use-case");
const makeDeleteVendor = require("./delete-vendor");
const makeGetVendors = require("./get-vendors");
const makePostVendor = require("./post-vendor");
const makePatchVendor = require("./patch-vendor");
// const notFound =require( "./not-found");

const deleteVendor = makeDeleteVendor({ removeVendor });
const getVendors = makeGetVendors({
  listVendors,
});
const postVendor = makePostVendor({ addVendor });
const patchVendor = makePatchVendor({ editVendor });

const vendorController = Object.freeze({
  deleteVendor,
  getVendors,
  //   notFound,
  postVendor,
  patchVendor,
});

module.exports = vendorController;
