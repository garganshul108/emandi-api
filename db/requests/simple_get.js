const connectionPool = require("../pool");

module.exports = (sql, req, res) => {
  return connectionPool.getConnection((err, connection) => {
    if (err) {
      console.log("Error while getting connection from the pool");
      console.log(err);
      connection.release();
      return res.status(500).send("Internal Server Error");
    }
    connection.query(sql, (err, results, fields) => {
      if (err) {
        console.log("Error while fetching the data from DB");
        console.log(err);
        connection.release();
        return res.status(400).send(err.message);
      }
      connection.release();
      console.log(fields);
      return res.status(200).send(results);
    });
  });
};
