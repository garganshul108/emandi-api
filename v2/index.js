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

// const fmt = (o) => JSON.parse(JSON.stringify(o));

// (async () => {
//   try {
//     let results = await db.CITY.destroy({ where: { city_id: 100 } });
//     // results = arrayLyze(results);
//     // results = results.map((res) => extract(res));
//     console.log(results);
//   } catch (e) {
//     console.log(modulator(e));
//   }
// })();
// console.log(db);

// console.fmtLog = (o) => console.log(fmt(o));

// (async () => {
//   try {
//     const res = await db.CROP.create({
//       crop_name: "Some name",
//       vendor_id: 2,
//       crop_qty: 122,
//       crop_price: -1212,
//     });
//     console.log(extract(res));
//   } catch (e) {
//     console.log("error");
//     console.fmtLog(e);
//   }
// })();

// (async () => {
//   try {
//     let unit = await db.unitOfWork();
//     // let state = await unit.create(db.STATE, {
//     //   name: "KK7asdagsdasd",
//     // });
//     // state = extract(state);
//     const city1 = await unit.create(db.CITY, {
//       name: "Gfuur7gaon",
//       state_id: 33,
//     });
//     const city2 = await unit.create(db.CITY, {
//       name: "GG3N0",
//       state_id: 33,
//     });
//     console.log(city1, city2);
//     await unit.complete();
//   } catch (e) {
//     console.log(e.errors);
//   }
// })();


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