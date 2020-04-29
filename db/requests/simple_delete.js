const connectionPool = require("../pool");

module.exports = (sql, req, res, callback) => {
  return connectionPool.getConnection((err, connection) => {
    if (err) {
      console.log("Error while getting connection from pool");
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
    return connection.query(sql, (err, results, fields) => {
      if (err) {
        connection.release();
        return res.status(400).send(err.message);
      }
      connection.release();
      return callback(req, res);
    });
  });
};
