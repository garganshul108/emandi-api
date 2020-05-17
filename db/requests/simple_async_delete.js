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
      return res.status(500).send([{ message: "Internal Server Error" }]);
    };
  }

  if (!callbacks.onDeleteFail) {
    callbacks.onDeleteFail = (req, res, err) => {
      console.log("DEFAULT 'Delete Fail' Occured");
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    };
  }

  if (!callbacks.onUnknownError) {
    callbacks.onUnknownError = (req, res, err) => {
      console.log("DEFAULT 'Unknown Error' Occured");
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    };
  }

  let connection = undefined;
  let errorOnDelete = true;
  try {
    connection = await promisifiedGetConnection(connectionPool);
    await promisifiedQuery(connection, sql, []);
    errorOnDelete = false;
    connection.release();
    if (callbacks.onSuccess) {
      callbacks.onSuccess(req, res);
    }
    return;
  } catch (err) {
    if (!connection) {
      if (callbacks.onGetConnectionFail) {
        callbacks.onGetConnectionFail(req, res, err);
      }
      return;
    } else if (errorOnDelete) {
      if (callbacks.onDeleteFail) {
        connection.release();
        callbacks.onDeleteFail(req, res, err);
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
