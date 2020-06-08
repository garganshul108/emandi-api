module.exports = (req, res, next) => {
  // console.log("HEADERS =>", JSON.stringify(req.headers));
  console.log("BODY =>", req.body);
  console.log("QUERY =>", req.query);
  next();
};
