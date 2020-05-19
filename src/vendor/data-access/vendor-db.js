const connectionPool = require("../pool");

const {
  promisifiedQuery,
  promisifiedGetConnection,
  promisifiedBeginTransaction,
  promisifiedRollback,
  promisifiedCommit,
} = require("../promisified_sql");

function makeVendorDb({ makeDb }) {
  return Object.freeze({
    findAll,
    findById,
    insert,
    remove,
    update,
  });
  async function findAll() {
    const connection = await promisifiedGetConnection(connectionPool);
    const sql = `select * from VENDOR`;
    const result = await promisifiedGetConnection(connection, sql, []);
    return resultsFormater(result);
  }
  async function findById({ id }) {
    const connection = await promisifiedGetConnection(connectionPool);
    const sql = `select * from VENDOR where vendor_id=${id}`;
    const result = await promisifiedGetConnection(connection, sql, []);
    return resultsFormater(result);
  }

  async function insert(vendorInfo) {
    const name = vendorInfo.getName(),
      address = vendorInfo.getAddress(),
      contact = vendorInfo.getContact(),
      profile_picture = vendorInfo.getProfilePicture();
    const state_id = address.getStateId(),
      city_id = address.getCityId(),
      long_address = address.getLongAddress();
    const connection = await promisifiedGetConnection(connectionPool);
    const sql = `insert into from VENDOR(name, )`;
    const result = await promisifiedGetConnection(connection, sql, []);
  }

  async function update({ id: _id, ...commentInfo }) {
    const db = await makeDb();
    const result = await db
      .collection("comments")
      .updateOne({ _id }, { $set: { ...commentInfo } });
    return result.modifiedCount > 0 ? { id: _id, ...commentInfo } : null;
  }
  async function remove({ id: _id }) {
    const db = await makeDb();
    const result = await db.collection("comments").deleteOne({ _id });
    return result.deletedCount;
  }
  async function findByHash(comment) {
    const db = await makeDb();
    const result = await db.collection("comments").find({ hash: comment.hash });
    const found = await result.toArray();
    if (found.length === 0) {
      return null;
    }
    const { _id: id, ...insertedInfo } = found[0];
    return { id, ...insertedInfo };
  }

  function resultsFormater(results) {
    return results.map(({ state_id, city_id, address, ...rest }) => ({
      address: {
        state_id,
        city_id,
        longAddress: address,
      },
      ...rest,
    }));
  }
}

module.exports = makeVendorDb;
