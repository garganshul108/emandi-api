const buildMakeState = ({ valid, sanitize }) => {
  const makeState = ({ id, name }) => {
    if (!name) {
      throw new Error("State name must be provided.");
    }

    if (id && !valid(id, { type: "number" })) {
      throw new Error("Invalid state id provided.");
    }
    if (name) {
      name = sanitize(name);
      if (!valid(name, { type: "string" })) {
        throw new Error("Invalid state name provided.");
      }
    }

    return Object.freeze({
      getName: () => name,
      getId: () => id,
    });
  };
  return makeState;
};

module.exports = buildMakeState;
