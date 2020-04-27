const express = require("express");
const router = express.Router();
const connectionPool = require("../db/pool");
const authAdmin = require("../middleware/auth_admin");
const decodeToken = require("../middleware/decode_token");

const simpleGET = require("../db/requests/simple_get");
const simpleDELETE = require("../db/requests/simple_delete");

router.get("/", (req, res) => {
  const sql = `select * from CITY`;
  return simpleGET(sql, req, res);
  // return connectionPool.getConnection((err, connection) => {
  //   if (err) {
  //     return res.status(500).send("Internal Server Error");
  //   }
  //   return connection.query(sql, (err, results, fields) => {
  //     if (err) {
  //       connection.release();
  //       return res.status(500).send("Internal Server Error");
  //     }
  //     connection.release();
  //     return res.status(200).send(results);
  //   });
  // });
});

router.post("/", [decodeToken, authAdmin], (req, res) => {
  const { name, state_id } = req.body;
  if (!name || !state_id) {
    return res
      .status(400)
      .send('"name" and "state_id" of the city must be specified');
  }

  return connectionPool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }
    return connection.beginTransaction((err) => {
      if (err) {
        console.log("transaction begin", err);
        return res.status(500).send("Internal Server Error");
      }

      let sql1 = `insert into CITY(name,state_id) values("${name}", ${state_id})`;
      return connection.query(sql1, (err, results, fields) => {
        if (err) {
          connection.rollback(() => {
            connection.release();
            console.log("Rollback while insert");
          });
          return res.status(400).send(err.message);
        }

        let sql2 = `select * from CITY where city_id=(LAST_INSERT_ID())`;
        return connection.query(sql2, (err, results, fields) => {
          if (err) {
            connection.rollback(() => {
              connection.release();
              console.log("Rollback while fetching", err);
            });
            console.log("Couldn't fetch the posted city");
            console.log(err);
            return res.status(500).send("Couldn't fetch the Post");
          }
          return connection.commit((err) => {
            if (err) {
              connection.rollback(() => {
                connection.release();
              });
              console.log("The Post City Commit Failed");
              console.log(err);
              return res.status(500).send("Last Commit Failed");
            }
            connection.release();
            return res.status(201).send(results);
          });
        });
      });
    });
  });
});

router.put("/", [decodeToken, authAdmin], (req, res) => {
  const { city_id, name, state_id } = req.body;
  if (!city_id && (!state_id || !name)) {
    return res
      .status(400)
      .send('"city_id" and ("state_id" and/or "name") must be specified');
  }

  return connectionPool.getConnection((err, connection) => {
    if (err) {
      console.log("Error while getting connection from the pool", err);
      return res.status(500).send("Internal Server Error");
    }
    return connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        console.log("transaction begin", err);
        return res.status(500).send("Internal Server Error");
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
      return connection.query(sql1, (err, results, fields) => {
        if (err) {
          connection.rollback(() => {
            connection.release();
          });
          console.log("after first query");
          console.log(err);
          return res.status(400).send(err.message);
        }
        console.log("First query pass");
        let sql2 = `select * from CITY where city_id="${city_id}"`;
        return connection.query(sql2, (err, results, fields) => {
          if (err) {
            connection.rollback(() => {
              connection.release();
            });
            return res.status(400).send(err.message);
          }
          connection.release();
          return res.status(201).send(results);
        });
      });
    });
  });
});

router.delete("/", [decodeToken, authAdmin], (req, res) => {
  const { city_id } = req.body;
  if (!city_id) {
    return res.status(400).send('"city_id" must be specified');
  }
  const sql = `delete from CITY where city_id="${city_id}";`;
  return simpleDELETE(sql, req, res, () => {
    return res.status(201).send("City Deleted Successfully");
  });
  // return connectionPool.getConnection((err, connection) => {
  //   if (err) {
  //     console.log("Error while getting connection from pool");
  //     console.log(err);
  //     return res.status(500).send("Internal Server Error");
  //   }
  //   return connection.query(sql, (err, results, fields) => {
  //     if (err) {
  //       connection.release();
  //       return res.status(400).send(err.message);
  //     }
  //     connection.release();
  //     return res.status(201).send("The city has been deleted");
  //   });
  // });
});

module.exports = router;
