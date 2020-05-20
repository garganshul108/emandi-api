module.exports = (object) => {
  for (let key in object) {
    if (object[key] === undefined || object[key] === null) {
      delete object[key];
    }
  }

  return object;
};
