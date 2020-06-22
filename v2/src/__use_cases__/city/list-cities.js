module.exports = makeListCities = ({ cityDb }) => {
  return (listCities = async ({ id, stateId }) => {
    let cities = undefined;
    if (id) {
      cities = await cityDb.findById({ id });
    } else if (stateId) {
      cities = await cityDb.findAllByStateId({ id: stateId });
    } else {
      cities = await cityDb.findAll();
    }

    return {
      fetchedCount: 1,
      result: cities,
    };
  });
};
