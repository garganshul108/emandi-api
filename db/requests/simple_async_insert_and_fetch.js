const connectionPool = require("../pool");

const {
  promisifiedQuery,
  promisifiedGetConnection,
  promisifiedBeginTransaction,
  promisifiedRollback,
  promisifiedCommit,
} = require("../promisified_sql");

module.exports = async (sql1, sql2, req, res, callbacks) => {
  callbacks = callbacks || {};
  let connection = undefined;
  let errorOnBeginTransaction = true;
  let errorOnInsert = true;
  let errorOnFetch = true;
  let errorOnCommit = true;
  try {
    connection = await promisifiedGetConnection(connectionPool);
    await promisifiedBeginTransaction(connection);
    errorOnBeginTransaction = false;
    await promisifiedQuery(connection, sql1, []);
    errorOnInsert = false;
    let { results } = await promisifiedQuery(connection, sql2, []);
    errorOnFetch = false;
    await promisifiedCommit(connection);
    errorOnCommit = false;
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
    } else if (errorOnBeginTransaction) {
      connection.release();
      if (callbacks.onBeginTransactionFail) {
        callbacks.afterBeginTransactionFail(req, res, err);
      }
      return;
    } else if (errorOnInsert) {
      connection.rollback(() => {
        connection.release();
      });
      if (callbacks.onInsertFail) {
        callbacks.onInsertFail(req, res, err);
      }
      return;
    } else if (errorOnFetch) {
      connection.rollback(() => {
        connection.release();
      });
      if (callbacks.onFetchFail) {
        callbacks.onFetchFail(req, res, err);
      }
      return;
    } else if (errorOnCommit) {
      connection.rollback(() => {
        connection.release();
      });
      if (callbacks.onCommitFail) {
        callbacks.onCommitFail(req, res, err);
      }
      return;
    } else {
      if (callbacks.onUnknownError) {
        callbacks.onUnknownError(req, res, err);
      }
      return;
    }
  }
};
