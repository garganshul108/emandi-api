const promisifiedGetConnection = (connectionPool) => {
  return new Promise((resolve, reject) => {
    connectionPool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });
};

const promisifiedQuery = (connection, sql, args) => {
  return new Promise((resolve, reject) => {
    if (!args) args = [];
    if (!connection) reject(new Error("Connection Object is not specified"));
    if (!sql) reject(new Error("Query is not specified"));
    connection.query(sql, args, (err, results, fields) => {
      if (err) {
        reject(err);
      }
      resolve({ results, fields });
    });
  });
};

const promisifiedBeginTransaction = (connection) => {
  return new Promise((resolve, reject) => {
    connection.beginTransaction((err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

const promisifiedCommit = (connection) => {
  return new Promise((resolve, reject) => {
    connection.commit((err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

const promisifiedRollback = (connection) => {
  return new Promise((resolve, reject) => {
    connection.rollback((err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

module.exports = {
  promisifiedQuery,
  promisifiedGetConnection,
  promisifiedBeginTransaction,
  promisifiedRollback,
  promisifiedCommit,
};

// (async () => {
//   try {
//     const connection = await promisifiedGetConnection(pool);
//     await promisifiedBeginTransaction(connection);
//     const query1 = "";
//     const { results: firstResult } = await promisifiedQuery(connection, query1);
//     const query2 = "" + firstResult;
//     const { results: secondResult } = await promisifiedQuery(
//       connection,
//       query2
//     );
//     // return res
//     connection.release();
//   } catch (err) {
//     // err => pool se connection get
//     // err => transaction initialte
//     // err => query running
//   } finally {
//   }
// });

// connection.beginTransaction((err) => {
//   if (err) {
//     // yahi se return transaction start karne me error aagya ahi
//   }
//   return connection.query(sql, args, (err, results, fields) => {
//     if (err) {
//       connection.rollback(() => {
//         //this is after rollback()
//       });
//       //next query
//       connection.query(sql, args, (err, results, fields) => {
//         if (err) {
//           // rollback
//           connection.rollback(() => {
//             // this is after rollback
//           });
//         }
//         // return result
//       });
//     }
//   });
// });
