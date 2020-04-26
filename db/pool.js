// // const mysql = require("mysql");
// // const settings = require("./settings");
// // let db;

// // function connectDatabase() {
// //   if (!db) {
// //     db = mysql.createConnection(settings);

// //     db.connect((err) => {
// //       if (!err) {
// //         console.log("Database is connected!");
// //       } else {
// //         console.log("Error connecting database!");
// //       }
// //     });
// //   }
// //   return db;
// // }

// // module.exports = connectDatabase();

// const settings = require("./settings");
// const mysql = require("mysql");

// class Database {
//   constructor(config) {
//     this.connection = mysql.createConnection(config);
//   }
//   query(sql, args) {
//     return new Promise((resolve, reject) => {
//       this.connection.query(sql, args, (err, rows) => {
//         if (err) return reject(err);
//         resolve(rows);
//       });
//     });
//   }
//   close() {
//     return new Promise((resolve, reject) => {
//       this.connection.end((err) => {
//         if (err) return reject(err);
//         resolve();
//       });
//     });
//   }

// }

// const beginTransaction = (queries) => {
//   return new Promise((resolve, reject)=>{
//     this.connection.beginTransaction(function(err) {
//       if (err) reject(err);
//       for(let query of queries){
//         this.connection.query(query.sql, query.args, function(err, result) {
//           if (err) {
//             this.connection.rollback(function() {
//               reject(err);
//             });
//           }
//       }

//         var log = result.insertId;

//         connection.query('INSERT INTO log SET logid=?', log, function(err, result) {
//           if (err) {
//             connection.rollback(function() {
//               throw err;
//             });
//           }
//           connection.commit(function(err) {
//             if (err) {
//               connection.rollback(function() {
//                 throw err;
//               });
//             }
//             console.log('Transaction Complete.');
//             connection.end();
//           });
//         });
//       });
//     });
//   });

// }

// let db = null;
// const getDatabaseConnection = () => {
//   if (!db) {
//     try {
//       db = new Database(settings);
//     } catch (err) {
//       db = null;
//       console.log("in catch", err);
//       return;
//     }
//   }

//   return db;
// };

// module.exports = getDatabaseConnection();

// const settings = require("./settings");
// const util = require("util");
// const mysql = require("mysql");

// function Database(config) {
//   const connection = mysql.createConnection(config);
//   return {
//     query(sql, args) {
//       return util.promisify(connection.query).call(connection, sql, args);
//     },
//     close() {
//       return util.promisify(connection.end).call(connection);
//     },
//     beginTransaction() {
//       return util.promisify(connection.beginTransaction).call(connection);
//     },
//     commit() {
//       return util.promisify(connection.commit).call(connection);
//     },
//     rollback() {
//       return util.promisify(connection.rollback).call(connection);
//     },
//   };
// }

// let db = undefined;
// function getDatabaseConnection() {
//   if (!db) {
//     db = new Database(settings);
//   }

//   return db;
// }

// module.exports = getDatabaseConnection();

const settings = require("./settings");
const mysql = require("mysql");

const pool = mysql.createPool(settings);
// pool.getConnection((err, connection) => {
//   if (err) {
//     console.log("Error while connecting to DB");
//     console.log(err);
//     return;
//   }
//   console.log("Database is connected!");
//   connection.release();
// });
console.log("POOOLLL EXECUTED");
module.exports = pool;
