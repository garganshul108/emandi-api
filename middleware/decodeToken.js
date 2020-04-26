const jwt = require("../util/jwt");
module.exports = (req, res, next) => {
  const token = req.headers["x-auth-token"];
  if (!token) {
    return res.status(401).send("Invalid Request Format. No token provided");
  }

  try {
    const decode = jwt.decodeToken(token);
    // console.log("decode", decode);
    req.actor = decode;
    next();
  } catch (ex) {
    console.log("Invalid token", ex);
    return res.status(400).send("Invalid token provided");
  }

  return;
};
