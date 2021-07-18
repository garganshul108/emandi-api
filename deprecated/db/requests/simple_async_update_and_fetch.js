const simpleAsyncInsertAndFetch = require("./simple_async_insert_and_fetch");
module.exports = async (sql1, sql2, req, res, callbacks) => {
  callbacks = callbacks || {};
  if (callbacks.onUpdateFail && !callbacks.onInsertFail) {
    callbacks.onInsertFail = callbacks.onUpdateFail;
  }
  return await simpleAsyncInsertAndFetch(sql1, sql2, req, res, callbacks);
};
