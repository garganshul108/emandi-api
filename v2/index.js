const router = require("express").Router();
// const vendor = require("./src/vendor");

// router.use("/vendor", vendor);

module.exports = router;
const db = require("./db");

const arrayLyze = (results) =>
  (results = Array.isArray(results)
    ? results
    : (results = results ? [results] : []));

const extract = (result) => result.toJSON();

// (async () => {
//   try {
//     let results = await db.VENDOR.findByPk(2, {
//       include: [{ model: db.CITY, include: [{ model: db.STATE }] }],
//     });
//     results = arrayLyze(results);
//     results = results.map((res) => extract(res));
//     console.log(results);
//   } catch (e) {
//     console.log(e);
//   }
// })();
