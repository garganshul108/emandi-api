module.exports = (req, res, next) => {
  if (!req.actor.isAdmin) {
    return res.status(403).send([{ message: "Access Denied" }]);
  }
  next();
};
