const makeVendorDb = require("./vendor-db");
const ORM = require("../../../db");

async function makeDb() {
  return ORM;
}

const vendorDb = makeVendorDb({ makeDb });
return vendorDb;
