const makeAdminDb = require("./admin-db");
const ORM = require("../../../db");

async function makeDb() {
  return ORM;
}

const adminDb = makeAdminDb({ makeDb });
module.exports = adminDb;
