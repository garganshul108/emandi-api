module.exports = (req, res, next) => {
  if (!req.actor.isVendor) {
    return res.status(403).send("Access Denied");
  }
  next();
};
