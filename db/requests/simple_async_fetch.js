const connectionPool = require("../pool");

const {
  promisifiedQuery,
  promisifiedGetConnection,
  promisifiedBeginTransaction,
  promisifiedRollback,
  promisifiedCommit,
} = require("../promisified_sql");

module.exports = async (sql, req, res, callbacks) => {
  callbacks = callbacks || {};
  let connection = undefined;
  try {
    connection = await promisifiedGetConnection(connectionPool);
    let { results } = await promisifiedQuery(connection, sql, []);
    connection.release();
    if (callbacks.onSuccess) {
      callbacks.onSuccess(req, res, results);
    }
    return;
  } catch (err) {
    if (!connection) {
      if (callbacks.onGetConnectionFail) {
        callbacks.onGetConnectionFail(req, res, err);
      }
      return;
    } else if (errorOnGet) {
      connection.release();
      if (callbacks.onFetchFail) {
        callbacks.onFetchFail(req, res, err);
      }
      return;
    } else {
      connection.release();
      if (callbacks.onUnknownError) {
        callbacks.onUnknownError(req, res, err);
      }
      return;
    }
  }
};
