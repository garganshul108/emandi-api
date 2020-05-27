module.exports = makeListStates = ({ stateDb, filterUndefined }) => {
  return (listStates = async ({ id, name }) => {
    let fetched = undefined;
    if (id) {
      fetched = stateDb.findById({ id });
    } else if (name) {
      fetched = stateDb.findAllByNameLike({ name });
    } else {
      fetched = stateDb.findAll();
    }
    return {
      foundCount: 1,
      result: fetched,
    };
  });
};
