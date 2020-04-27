const connectionPool = require("../pool");

module.exports = (sql, req, res, callback) => {
  return connectionPool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).send("Internal Server Error");
    }
    return connection.beginTransaction((err) => {
      if (err) {
        console.log("transaction begin", err);
        connection.release();
        return res.status(500).send("Internal Server Error");
      }
      return connection.query(sql[0], (err, results, fields) => {
        if (err) {
          connection.rollback(() => {
            connection.release();
            console.log("Rollback while insert");
          });
          return res.status(400).send(err.message);
        }

        return connection.query(sql[1], (err, results, fields) => {
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
};
