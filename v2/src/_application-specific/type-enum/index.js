const TYPE_ENUM = {
  vendor: "vendor",
  user: "user",
  admin: "admin",
};

const valid = (input) => {
  for (let key in TYPE_ENUM) {
    if (input === TYPE_ENUM[key]) {
      return true;
    }
  }

  return false;
};

const verify = {};

for (let key in TYPE_ENUM) {
  verify[key] = (input) => input === TYPE_ENUM[key];
}

verify = Object.freeze(verify);

module.exports = Object.freeze({
  verify,
  valid,
});
