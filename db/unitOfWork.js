const pool = require("./pool");

module.exports = async () => {
  const t = await pool.transaction();
  // console.log(t);

  const complete = async () => {
    try {
      await t.commit();
    } catch (e) {
      console.log("RB compl");
      await t.rollback();
      throw e;
    }
  };

  const create = async (model, ...ops) => {
    try {
      return await model.create(...ops, { transaction: t });
    } catch (e) {
      console.log("RB cretae");
      await t.rollback();
      throw e;
    }
  };

  const update = async (model, ...ops) => {
    try {
      return await model.update(...ops, { transaction: t });
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  return Object.freeze({
    complete,
    create,
    update,
  });
};
