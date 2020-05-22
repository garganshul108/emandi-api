const buildMakeCity = ({ sanitize, valid, makeState }) => {
  const makeCity = ({ id, name, state = {} }) => {
    if (id && !valid(id, { type: "number" })) {
      throw new Error("Invalid city id provided");
    }

    if (name) {
      name = sanitize(name);
      if (!valid(name, { type: "string" })) {
        throw new Error("Invalid city name provided");
      }
    }

    state = makeState(state);

    return Object.freeze({
      getState: () => state,
      getName: () => name,
      getId: () => id,
    });
  };
  return makeCity;
};

module.exports = buildMakeCity;
