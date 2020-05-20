const filter = (object) => {
  for (let key in object) {
    if (object[key] === undefined || object[key] === null) {
      delete object[key];
    }
    if (typeof object[key] === "object") {
      object[key] = filter(object);
    }
  }

  return object;
};

module.exports = filter;
