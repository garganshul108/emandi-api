const connectionPool = require("../pool");

const {
  promisifiedQuery,
  promisifiedGetConnection,
  promisifiedBeginTransaction,
  promisifiedRollback,
  promisifiedCommit,
} = require("../promisified_sql");

module.exports = async (sqls, req, res, callbacks) => {
  if (!Array.isArray(sqls)) {
    sqls = [sqls];
  }
  callbacks = callbacks || {};

  let noOfQueries = sqls.length;

  if (!callbacks.onExplicitQueryFail) {
    callbacks.onExplicitQueryFail = (req, res, err) => {
      console.log("DEFAULT 'some explicit query' fail");
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    };
  }
  if (!callbacks.onGetConnectionFail) {
    callbacks.onGetConnectionFail = (req, res, err) => {
      console.log("DEFAULT 'getConnection' from the pool fail");
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

  if (!callbacks.onCommitFail) {
    callbacks.onCommitFail = (req, res, err) => {
      console.log("DEFAULT 'Commit' Fail");
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    };
  }

  if (!callbacks.onBeginTransactionFail) {
    callbacks.onBeginTransactionFail = (req, res, err) => {
      console.log("DEFAULT 'Begin Transaction' Fail");
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    };
  }

  let connection = undefined;
  let errorOnBeginTransaction = true;
  let errorOnQuery = [];
  for (let i = 0; i < noOfQueries; i++) {
    errorOnQuery[i] = true;
  }
  let errorOnExplicitQueries = true;
  let errorOnCommit = true;
  try {
    connection = await promisifiedGetConnection(connectionPool);
    await promisifiedBeginTransaction(connection);
    errorOnBeginTransaction = false;
    let resultsFromPreviousQuery = {},
      fieldsFromPreviousQuery = {};
    for (let i = 0; i < noOfQueries; i++) {
      let sql = sqls[i].getQueryStatement(
        resultsFromPreviousQuery,
        fieldsFromPreviousQuery
      );
      let sqlOptions = [];
      if (sqls[i].getQueryOptions) {
        sqlOptions = sqls[i].getQueryOptions(
          resultsFromPreviousQuery,
          fieldsFromPreviousQuery
        );
      }
      let { results, fields } = await promisifiedQuery(
        connection,
        sql,
        sqlOptions
      );
      errorOnQuery[i] = false;
      resultsFromPreviousQuery[`query_${i + 1}`] = results;
      fieldsFromPreviousQuery[`query_${i + 1}`] = fields;
      console.log("Query", i, "Ran", "Just above Unsatisfied");
      if (sqls[i].checkQueryResultSatisfaction) {
        console.log("Running Unatisfied");
        const { statisfactionStatus: satisfied, action } = sqls[
          i
        ].checkQueryResultSatisfaction(
          resultsFromPreviousQuery,
          fieldsFromPreviousQuery
        );
        if (!satisfied) {
          if (action)
            action(req, res, resultsFromPreviousQuery, fieldsFromPreviousQuery);
          connection.rollback(() => connection.release());
          return;
        } else {
          if (action)
            action(req, res, resultsFromPreviousQuery, fieldsFromPreviousQuery);
        }
      }
    }
    errorOnExplicitQueries = false;
    await promisifiedCommit(connection);
    errorOnCommit = false;
    connection.release();
    if (callbacks.onSuccess) {
      callbacks.onSuccess(req, res, resultsFromPreviousQuery);
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
    } else if (errorOnExplicitQueries) {
      connection.rollback(() => {
        connection.release();
      });
      for (let i = 0; i < noOfQueries; i++) {
        if (!errorOnQuery[i]) {
          continue;
        }
        if (sqls[i].onQueryFail) {
          sqls[i].onQueryFail(req, res, err);
        } else if (callbacks.onExplicitQueryFail) {
          callbacks.onExplicitQueryFail(req, res, err);
        }
        return;
      }
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
