const router = require("express").Router();
module.exports = router;
const db = require("../db");

const arrayLyze = (results) =>
  (results = Array.isArray(results)
    ? results
    : (results = results ? [results] : []));

const extract = (result) => result.toJSON();

(async () => {
  try {
    let results = await db.CROP.findAll({
      where: {
        description: undefined
      },
      default: {
        description: null
      }
    })
    results = results.length <= 0 ? null : results.map(res => extract(res))
    // console.log(extract(results));
    console.log(results);
  } catch (e) {
    console.log(e);
  }
})();