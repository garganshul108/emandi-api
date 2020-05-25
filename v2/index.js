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
//     let results = await db.CITY.destroy({ where: { city_id: 6 } });
//     // results = arrayLyze(results);
//     // results = results.map((res) => extract(res));
//     console.log(results);
//   } catch (e) {
//     console.log(e.message);
//   }
// })();
// console.log(db);

// (async () => {
//   try {
//     await db.CROP_TYPE.destroy({ where: { crop_type_id: 1 } });
//   } catch (e) {
//     console.log(e);
//   }
// })();
