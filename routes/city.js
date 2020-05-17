const express = require("express");
const router = express.Router();
// const connectionPool = require("../db/pool");
const authAdmin = require("../middleware/auth_admin");
const decodeToken = require("../middleware/decode_token");

// const simpleGET = require("../db/requests/simple_get");
// const simpleDELETE = require("../db/requests/simple_delete");
const simpleAsyncDELETE = require("../db/requests/simple_async_delete");
const simpleAsyncInsertAndFetch = require("../db/requests/simple_async_insert_and_fetch");
const simpleAsyncFetch = require("../db/requests/simple_async_fetch");
const simpleAsyncUpdateAndFetch = require("../db/requests/simple_async_update_and_fetch");

// router.get("/", (req, res) => {
//   const sql = `select * from CITY`;
//   return simpleGET(sql, req, res);
//   // return connectionPool.getConnection((err, connection) => {
//   //   if (err) {
//   //     return res.status(500).send([{message:"Internal Server Error"}]);
//   //   }
//   //   return connection.query(sql, (err, results, fields) => {
//   //     if (err) {
//   //       connection.release();
//   //       return res.status(500).send([{message:"Internal Server Error"}]);
//   //     }
//   //     connection.release();
//   //     return res.status(200).send(results);
//   //   });
//   // });
// });

router.get("/", async (req, res) => {
  const sql = `select * from CITY`;
  const callbacks = {
    onSuccess: (req, res, results) => {
      return res.status(200).send(results);
    },
    onGetConnectionFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    },
    onFetchFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    },
  };
  return await simpleAsyncFetch(sql, req, res, callbacks);
});

// router.post("/", [decodeToken, authAdmin], (req, res) => {
//   const { name, state_id } = req.body;
//   if (!name || !state_id) {
//     return res
//       .status(400)
//       .send([{message:'"name" and "state_id" of the city must be specified'}]);
//   }

//   return connectionPool.getConnection((err, connection) => {
//     if (err) {
//       return res.status(500).send([{message:"Internal Server Error"}]);
//     }
//     return connection.beginTransaction((err) => {
//       if (err) {
//         console.log("transaction begin", err);
//         return res.status(500).send([{message:"Internal Server Error"}]);
//       }

//       let sql1 = `insert into CITY(name,state_id) values("${name}", ${state_id})`;
//       return connection.query(sql1, (err, results, fields) => {
//         if (err) {
//           connection.rollback(() => {
//             connection.release();
//             console.log("Rollback while insert");
//           });
//           return res.status(400).send([{message:err.message}]);
//         }

//         let sql2 = `select * from CITY where city_id=(LAST_INSERT_ID())`;
//         return connection.query(sql2, (err, results, fields) => {
//           if (err) {
//             connection.rollback(() => {
//               connection.release();
//               console.log("Rollback while fetching", err);
//             });
//             console.log("Couldn't fetch the posted city");
//             console.log(err);
//             return res.status(500).send([{message:"Couldn't fetch the Post"}]);
//           }
//           return connection.commit((err) => {
//             if (err) {
//               connection.rollback(() => {
//                 connection.release();
//               });
//               console.log("The Post City Commit Failed");
//               console.log(err);
//               return res.status(500).send([{message:"Last Commit Failed"}]);
//             }
//             connection.release();
//             return res.status(201).send(results);
//           });
//         });
//       });
//     });
//   });
// });

router.post("/", [decodeToken, authAdmin], async (req, res) => {
  const { name, state_id } = req.body;
  if (!name || !state_id) {
    return res
      .status(400)
      .send([
        { message: '"name" and "state_id" of the city must be specified' },
      ]);
  }
  let sql1 = `insert into CITY(name,state_id) values("${name}", ${state_id})`;
  let sql2 = `select * from CITY where city_id=(LAST_INSERT_ID())`;

  const callbacks = {
    onSuccess: (req, res, results) => {
      return res.status(201).send(results);
    },
    onGetConnectionFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    },
    onInsertFail: (req, res, err) => {
      console.log(err);
      return res.status(400).send([{ message: err.message }]);
    },
    onFetchFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    },
    onCommitFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    },
    onUnknownError: (req, res, err) => {
      console.log("Unknown Error");
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    },
  };
  try {
    await simpleAsyncInsertAndFetch(sql1, sql2, req, res, callbacks);
  } catch (err) {
    console.log("Overall Code break");
    console.log(err);
  }
  return;
});

// router.put("/", [decodeToken, authAdmin], (req, res) => {
//   const { city_id, name, state_id } = req.body;
//   if (!city_id && (!state_id || !name)) {
//     return res
//       .status(400)
//       .send([{message:'"city_id" and ("state_id" and/or "name") must be specified'}]);
//   }

//   return connectionPool.getConnection((err, connection) => {
//     if (err) {
//       console.log("Error while getting connection from the pool", err);
//       return res.status(500).send([{message:"Internal Server Error"}]);
//     }
//     return connection.beginTransaction((err) => {
//       if (err) {
//         connection.release();
//         console.log("transaction begin", err);
//         return res.status(500).send([{message:"Internal Server Error"}]);
//       }
//       let subSql = [];
//       subSql[0] = name ? `name = "${name}"` : null;
//       subSql[1] = state_id ? `state_id =${state_id}` : null;
//       let subSqlStart = `update CITY set `;
//       let subSqlEnd = ` where city_id="${city_id}"`;
//       let sql1 = `` + subSqlStart;
//       let first = true;
//       for (let sub of subSql) {
//         if (sub) {
//           if (!first) {
//             sql1 = sql1 + `,` + sub;
//           } else {
//             sql1 = sql1 + sub;
//             first = false;
//           }
//         }
//       }
//       sql1 = sql1 + subSqlEnd;
//       return connection.query(sql1, (err, results, fields) => {
//         if (err) {
//           connection.rollback(() => {
//             connection.release();
//           });
//           console.log("after first query");
//           console.log(err);
//           return res.status(400).send([{message:err.message}]);
//         }
//         console.log("First query pass");
//         let sql2 = `select * from CITY where city_id="${city_id}"`;
//         return connection.query(sql2, (err, results, fields) => {
//           if (err) {
//             connection.rollback(() => {
//               connection.release();
//             });
//             return res.status(400).send([{message:err.message}]);
//           }
//           connection.release();
//           return res.status(201).send(results);
//         });
//       });
//     });
//   });
// });

router.put("/", [decodeToken, authAdmin], async (req, res) => {
  const { city_id, name, state_id } = req.body;
  if (!city_id && (!state_id || !name)) {
    return res
      .status(400)
      .send([
        {
          message: '"city_id" and ("state_id" and/or "name") must be specified',
        },
      ]);
  }

  let subSql = [];
  subSql[0] = name ? `name = "${name}"` : null;
  subSql[1] = state_id ? `state_id =${state_id}` : null;
  let subSqlStart = `update CITY set `;
  let subSqlEnd = ` where city_id="${city_id}"`;
  let sql1 = `` + subSqlStart;
  let first = true;
  for (let sub of subSql) {
    if (sub) {
      if (!first) {
        sql1 = sql1 + `,` + sub;
      } else {
        sql1 = sql1 + sub;
        first = false;
      }
    }
  }
  sql1 = sql1 + subSqlEnd;
  let sql2 = `select * from CITY where city_id="${city_id}"`;

  const callbacks = {
    onSuccess: (req, res, results) => {
      return res.status(201).send(results);
    },
    onBeginTransactionFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    },
    onCommitFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    },
    onUpdateFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send([{ message: err.message }]);
    },
    onFetchFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    },
    onGetConnectionFail: (req, res, err) => {
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    },
    onUnknownError: (req, res, err) => {
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    },
  };
  return await simpleAsyncUpdateAndFetch(sql1, sql2, req, res, callbacks);
  // return connectionPool.getConnection((err, connection) => {
  //   if (err) {
  //     console.log("Error while getting connection from the pool", err);
  //     return res.status(500).send([{message:"Internal Server Error"}]);
  //   }
  //   return connection.beginTransaction((err) => {
  //     if (err) {
  //       connection.release();
  //       console.log("transaction begin", err);
  //       return res.status(500).send([{message:"Internal Server Error"}]);
  //     }

  //     return connection.query(sql1, (err, results, fields) => {
  //       if (err) {
  //         connection.rollback(() => {
  //           connection.release();
  //         });
  //         console.log("after first query");
  //         console.log(err);
  //         return res.status(400).send([{message:err.message}]);
  //       }
  //       console.log("First query pass");
  //       return connection.query(sql2, (err, results, fields) => {
  //         if (err) {
  //           connection.rollback(() => {
  //             connection.release();
  //           });
  //           return res.status(400).send([{message:err.message}]);
  //         }
  //         connection.release();
  //         return res.status(201).send(results);
  //       });
  //     });
  //   });
  // });
});

// router.delete("/", [decodeToken, authAdmin], (req, res) => {
//   const { city_id } = req.body;
//   if (!city_id) {
//     return res.status(400).send([{message:'"city_id" must be specified'}]);
//   }
//   const sql = `delete from CITY where city_id="${city_id}";`;
//   return simpleDELETE(sql, req, res, () => {
//     return res.status(201).send([{message:"City Deleted Successfully"}]);
//   });
//   // return connectionPool.getConnection((err, connection) => {
//   //   if (err) {
//   //     console.log("Error while getting connection from pool");
//   //     console.log(err);
//   //     return res.status(500).send([{message:"Internal Server Error"}]);
//   //   }
//   //   return connection.query(sql, (err, results, fields) => {
//   //     if (err) {
//   //       connection.release();
//   //       return res.status(400).send([{message:err.message}]);
//   //     }
//   //     connection.release();
//   //     return res.status(201).send([{message:"The city has been deleted"}]);
//   //   });
//   // });
// });

router.delete("/:city_id", [decodeToken, authAdmin], async (req, res) => {
  const { city_id } = req.params;
  if (!city_id) {
    return res.status(400).send([{ message: '"city_id" must be specified' }]);
  }
  const sql = `delete from CITY where city_id=${city_id};`;
  const callbacks = {
    onSuccess: (req, res) => {
      return res.status(201).send([{ message: "City-- Deleted Successfully" }]);
    },
    onGetConnectionFail: (req, res, err) => {
      console.log("on get connection fail");
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    },
    onDeleteFail: (req, res, err) => {
      console.log("on delete Fail");
      console.log(err);
      return res.status(500).send([{ message: err.message }]);
    },
  };
  return await simpleAsyncDELETE(sql, req, res, callbacks);
});

module.exports = router;
