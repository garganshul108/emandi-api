module.exports = makeCityDb = ({ makeDb, extractData, arralyzeData }) => {
  const findById = async ({ id }) => {
    const db = await makeDb();
    const city = await db.CITY.findByPk(id);
    city = arralyzeData(city);
    city = city && city.map((res) => extractData(res));
    return city;
  };

  const findAll = async (options) => {
    const db = await makeDb();
    let cities = undefined;
    if (!options) {
      cities = await db.CITY.findAll();
    } else {
      cities = await db.CITY.findAll({ where: options });
    }
    cities = arralyzeData(city);
    cities = cities && cities.map((res) => extractData(res));
    return cities;
  };

  const insert = async ({ name, state_id }) => {
    const db = await makeDb();
    const city = await db.CITY.create({
      name,
      state_id,
    });
    city = arralyzeData(city);
    city = city && city.map((res) => extractData(res));
    return city;
  };

  const updateById = async ({ id, ...cityInfo }) => {
    const db = await makeDb();
    const city = await db.CITY.update(cityInfo, { where: { city_id: id } });
    city = arralyzeData(city);
    city = city && city.map((res) => extractData(res));
    return city;
  };
  const removeById = async ({ id }) => {
    const db = await makeDb();
    const deleteCount = await db.CITY.destroy({ where: { city_id: id } });
    return deleteCount;
  };

  return Object.freeze({
    findById,
    findAll,
    insert,
    updateById,
    removeById,
  });
};
