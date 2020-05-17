const express = require("express");
const router = express.Router();
const connectionPool = require("../db/pool");
const authAdmin = require("../middleware/auth_admin");
const decodeToken = require("../middleware/decode_token");
const {
  promisifiedBeginTransaction,
  promisifiedCommit,
  promisifiedQuery,
  promisifiedGetConnection,
} = require("../db/promisified_sql");
const simpleGET = require("../db/requests/simple_get");

router.get("/", (req, res) => {
  const sql = `select * from STATE`;
  return simpleGET(sql, req, res);
  // return connectionPool.getConnection((err, connection) => {
  //   if (err) {
  //     return res.status(500).send([{message:"Internal Server Error"}]);
  //   }
  //   return connection.query(sql, (err, results, fields) => {
  //     if (err) {
  //       connection.release();
  //       return res.status(500).send([{message:"Internal Server Error"}]);
  //     }
  //     connection.release();
  //     return res.status(200).send(results);
  //   });
  // });
});

router.put("/", [decodeToken, authAdmin], (req, res) => {
  const { state_id, name } = req.body;
  if (!state_id || !name) {
    return res
      .status(400)
      .send([{ message: '"state_id" and "name" must be specified' }]);
  }

  return connectionPool.getConnection((err, connection) => {
    if (err) {
      console.log("Error while getting connection from the pool", err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    }
    return connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        console.log("transaction begin", err);
        return res.status(500).send([{ message: "Internal Server Error" }]);
      }

      let sql1 = `update STATE set name = "${name}" where state_id="${state_id}"`;
      return connection.query(sql1, (err, results, fields) => {
        if (err) {
          connection.rollback(() => {
            connection.release();
          });
          return res.status(400).send([{ message: err.message }]);
        }
        if (results.changedRows <= 0) {
          connection.rollback(() => {
            connection.release();
          });
          return res
            .status(400)
            .send([
              { message: "Not a valid state_id, Hence no rows affected" },
            ]);
        }
        let sql2 = `select * from STATE where state_id="${state_id}"`;
        return connection.query(sql2, (err, results, fields) => {
          if (err) {
            connection.rollback(() => {
              connection.release();
            });
            return res.status(400).send([{ message: err.message }]);
          }
          connection.release();
          return res.status(201).send(results);
        });
      });
    });
  });
});

router.delete("/:state_id", [decodeToken, authAdmin], (req, res) => {
  const { state_id } = req.params;
  if (!state_id) {
    return res.status(400).send([{ message: '"state_id" must be specified' }]);
  }

  return connectionPool.getConnection((err, connection) => {
    if (err) {
      console.log("Error while getting connection from pool");
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    }
    const sql = `delete from STATE where state_id="${state_id}";`;
    return connection.query(sql, (err, results, fields) => {
      if (err) {
        connection.release();
        return res.status(400).send([{ message: err.message }]);
      }
      connection.release();
      return res.status(201).send([{ message: "The state has been deleted" }]);
    });
  });
});

// router.post("/", [decodeToken, authAdmin], (req, res) => {
//   const { name } = req.body;
//   if (!name) {
//     return res.status(400).send([{message:'"name" of the state must be specified'}]);
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

//       let sql1 = `insert into STATE(name) values("${name}")`;
//       return connection.query(sql1, (err, results, fields) => {
//         if (err) {
//           connection.rollback(() => {
//             connection.release();
//             console.log("Rollback while insert");
//           });
//           return res.status(400).send([{message:"State Already Exists"}]);
//         }

//         let sql2 = `select * from STATE where name="${name}"`;
//         return connection.query(sql2, (err, results, fields) => {
//           if (err) {
//             connection.rollback(() => {
//               connection.release();
//               console.log("Rollback while fetching", err);
//             });
//             return res.status(500).send([{message:"Couldn't fetch the Post"}]);
//           }
//           return connection.commit((err) => {
//             if (err) {
//               connection.rollback(() => {
//                 connection.release();
//               });
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
  const { name } = req.body;
  if (!name) {
    return res
      .status(400)
      .send([{ message: '"name" of the state must be specified' }]);
  }

  let connection = null;
  let errorOnBeginTransaction = true;
  let errorOnInsertingState = true;
  let errorOnFetchingState = true;
  let errorOnCommit = true;
  try {
    connection = await promisifiedGetConnection(connectionPool);
    await promisifiedBeginTransaction(connection);
    errorOnBeginTransaction = false;

    const sql1 = `insert into STATE(name) values("${name}")`;
    const { results: noResult } = await promisifiedQuery(connection, sql1, []);
    errorOnInsertingState = false;

    const sql2 = `select * from STATE where name="${name}"`;
    const { results: states } = await promisifiedQuery(connection, sql2, []);
    errorOnFetchingState = false;

    await promisifiedCommit(connection);
    errorOnCommit = false;

    connection.release();
    return res.status(200).send(states);
  } catch (err) {
    if (!connection) {
      console.log("Error on getting connection");
      console.log(err);
      return res.status(500).send([{ message: "Internal Server Error" }]);
    } else if (errorOnBeginTransaction) {
      console.log("Error on starting transaction");
      console.log(err);
      connection.release();
      return res.status(500).send([{ message: "Internal Server Error" }]);
    } else if (errorOnInsertingState) {
      console.log("Error on inserting state");
      console.log(err);
      connection.rollback(() => {
        connection.release();
      });
      return res.status(400).send([{ message: err.message }]);
    } else if (errorOnFetchingState) {
      console.log("Error on fetching state");
      console.log(err);
      connection.rollback(() => {
        connection.release();
      });
      return res.status(400).send([{ message: err.message }]);
    } else if (errorOnCommit) {
      connection.rollback(() => {
        connection.release();
      });
      return res
        .status(500)
        .send([{ message: "state not saved, Internal Server Error" }]);
    } else {
      console.log(err);
      return res
        .status(500)
        .send([{ message: "Something unhandled went wrong" }]);
    }
  }
});

// return connectionPool.getConnection((err, connection) => {
//   if (err) {
//     return res.status(500).send([{message:"Internal Server Error"}]);
//   }
//   return connection.beginTransaction((err) => {
//     if (err) {
//       console.log("transaction begin", err);
//       return res.status(500).send([{message:"Internal Server Error"}]);
//     }

//     let sql1 = `insert into STATE(name) values("${name}")`;
//     return connection.query(sql1, (err, results, fields) => {
//       if (err) {
//         connection.rollback(() => {
//           connection.release();
//           console.log("Rollback while insert");
//         });
//         return res.status(400).send([{message:"State Already Exists"}]);
//       }

//       let sql2 = `select * from STATE where name="${name}"`;
//       return connection.query(sql2, (err, results, fields) => {
//         if (err) {
//           connection.rollback(() => {
//             connection.release();
//             console.log("Rollback while fetching", err);
//           });
//           return res.status(500).send([{message:"Couldn't fetch the Post"}]);
//         }
//         return connection.commit((err) => {
//           if (err) {
//             connection.rollback(() => {
//               connection.release();
//             });
//             return res.status(500).send([{message:"Last Commit Failed"}]);
//           }
//           connection.release();
//           return res.status(201).send(results);
//         });
//       });
//     });
//   });
// });

module.exports = router;
