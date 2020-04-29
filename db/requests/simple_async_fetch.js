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
  if (!callbacks.onGetConnectionFail) {
    callbacks.onGetConnectionFail = (req, res, err) => {
      console.log("DEFAULT 'getConnection' from the pool fail");
      console.log(err);
      return res.status(500).send("Internal Server Error");
    };
  }
  if (!callbacks.onFetchFail) {
    callbacks.onFetchFail = (req, res, err) => {
      console.log("DEFAULT 'Fetch' fail");
      console.log(err);
      return res.status(500).send("Internal Server Error");
    };
  }
  if (!callbacks.onUnknownError) {
    callbacks.onUnknownError = (req, res, err) => {
      console.log("DEFAULT 'Unknown Error' Occured");
      console.log(err);
      return res.status(500).send("Internal Server Error");
    };
  }
  let connection = undefined;
  let errorOnFetch = true;
  try {
    connection = await promisifiedGetConnection(connectionPool);
    let { results } = await promisifiedQuery(connection, sql, []);
    errorOnFetch = false;
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
    } else if (errorOnFetch) {
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
