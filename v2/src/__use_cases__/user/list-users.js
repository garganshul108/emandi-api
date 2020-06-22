const makeListUsers = ({ userDb }) => {
  const listUsers = async ({ id, cityId, stateId }) => {
    let user = null;
    if (id) {
      user = await userDb.findById({ id });
    }

    if (cityId) {
      user = await userDb.findAllByCityId({ city_id: cityId });
    }

    if (stateId) {
      user = await userDb.findAllByStateId({ state_id: stateId });
    }

    if (!user) {
      return {
        fetchedCount: 0,
        message: "No user exists with such credentials.",
      };
    }
    return {
      fetchedCount: 1,
      result: user,
    };
  };
  return listUsers;
};

module.exports = makeListUsers;
