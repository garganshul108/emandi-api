const makeListUsers = ({ userDb }) => {
  const listUsers = async ({ id, city_id, state_id }) => {
    let user = null;
    if (id) {
      user = await userDb.findById({ id });
    }

    if (city_id) {
      user = await userDb.findAllByCityId({ city_id });
    }

    if (state_id) {
      user = await userDb.findAllByStateId({ state_id });
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
