const buildMakeCity = ({ sanitize, valid, makeState }) => {
  const makeCity = ({ id, name, stateId }) => {
    if (!name) {
      throw new Error("City name must be provided.");
    }

    if (!stateId) {
      throw new Error("State id must be provided.");
    }

    if (id && !valid(id, { type: "number" })) {
      throw new Error("Invalid city id provided.");
    }

    if (name) {
      name = sanitize(name);
      if (!valid(name, { type: "string" })) {
        throw new Error("Invalid city name provided.");
      }
    }

    return Object.freeze({
      getStateId: () => stateId,
      getName: () => name,
      getId: () => id,
    });
  };

  return makeCity;
};

module.exports = buildMakeCity;
