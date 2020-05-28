module.exports = makeListCities = ({ cityDb }) => {
  return (listCities = async ({ id, state_id }) => {
    let cities = undefined;
    if (id) {
      cities = await cityDb.findById({ id });
    } else if (state_id) {
      cities = await cityDb.findAllByStateId({ id });
    } else {
      cities = await cityDb.findAll();
    }

    return {
      fetchedCount: 1,
      result: cities,
    };
  });
};
