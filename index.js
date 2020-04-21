const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.write("Emandi Server is active");
  res.end();
});

app.listen(PORT, () => {
  console.log(`Listening to Port ${PORT}`);
});
