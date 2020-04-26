const express = require("express");
const router = express.Router();
const connectionPool = require("../db/pool");
const checkAdmin = require("../middleware/checkAdmin");
const decodeToken = require("../middleware/decodeToken");

router.get("/", (req, res) => {
  const sql = `select * from STATE`;
  return connectionPool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }
    return connection.query(sql, (err, results, fields) => {
      if (err) {
        connection.release();
        return res.status(500).send("Internal Server Error");
      }
      connection.release();
      return res.status(200).send(results);
    });
  });
});

router.put("/", [decodeToken, checkAdmin], (req, res) => {
  const { state_id, name } = req.body;
  if (!state_id || !name) {
    return res.status(400).send('"state_id" and "name" must be specified');
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

      let sql1 = `update STATE set name = "${name}" where state_id="${state_id}"`;
      return connection.query(sql1, (err, results, fields) => {
        if (err) {
          connection.rollback(() => {
            connection.release();
          });
          return res.status(400).send(err.message);
        }
        if (results.changedRows <= 0) {
          connection.rollback(() => {
            connection.release();
          });
          return res
            .status(400)
            .send("Not a valid state_id, Hence no rows affected");
        }
        let sql2 = `select * from STATE where state_id="${state_id}"`;
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

router.delete("/", [decodeToken, checkAdmin], (req, res) => {
  const { state_id } = req.body;
  if (!state_id) {
    return res.status(400).send('"state_id" must be specified');
  }

  return connectionPool.getConnection((err, connection) => {
    if (err) {
      console.log("Error while getting connection from pool");
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
    const sql = `delete from STATE where state_id="${state_id}";`;
    return connection.query(sql, (err, results, fields) => {
      if (err) {
        connection.release();
        return res.status(400).send(err.message);
      }
      connection.release();
      return res.status(201).send("The state has been deleted");
    });
  });
});

router.post("/", [decodeToken, checkAdmin], (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send('"name" of the state must be specified');
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

      let sql1 = `insert into STATE(name) values("${name}")`;
      return connection.query(sql1, (err, results, fields) => {
        if (err) {
          connection.rollback(() => {
            connection.release();
            console.log("Rollback while insert");
          });
          return res.status(400).send("State Already Exists");
        }

        let sql2 = `select * from STATE where name="${name}"`;
        return connection.query(sql2, (err, results, fields) => {
          if (err) {
            connection.rollback(() => {
              connection.release();
              console.log("Rollback while fetching", err);
            });
            return res.status(500).send("Couldn't fetch the Post");
          }
          return connection.commit((err) => {
            if (err) {
              connection.rollback(() => {
                connection.release();
              });
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

module.exports = router;
