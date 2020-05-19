const Sequelize = require("sequelize");
const config = require("config");
const host = config.get("db-host");
const user = config.get("db-user");
const passwd = config.get("db-password");
const database = config.get("db-name");

const sequelize = new Sequelize(database, user, passwd, {
  host: host,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

(async (sequelize) => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully");
  } catch (err) {
    console.log("Unable to connect to the databsae: ", err);
  }
})(sequelize);
