// setting the logging global object
require("./log");

const PORT = process.env.PORT || 8080;
const app = require("express")();
app.listen(PORT, () => {
  log.info(`Listening to ${PORT}...`);
});

require('./express-extensions')(app);
const routes = require("./routes");
app.use(routes);
