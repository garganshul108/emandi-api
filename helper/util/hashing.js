const bcrypt = require("bcrypt");
const config = require("config");

const saltLevel = parseInt(config.get("bcrypt-salt-level"));

const hash = async (input) => {
  const salt = await bcrypt.genSalt(saltLevel);
  const hashedValue = await bcrypt.hash(input, salt);
  return hashedValue;
};

const compare = async (newValue, hashedValue) => {
  const result = await bcrypt.compare(newValue, hashedValue);
  return result;
};

module.exports = {
  hash,
  compare,
};
