module.exports = (req, res, next) => {
  // console.log(req.actor);
  if (!req.actor.isVendor) {
    return res.status(403).send([{ message: "Access Denied" }]);
  }
  next();
};
