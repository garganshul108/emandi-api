let cache = {};

const add = ({ id, ...info }) => {
  if (!cache[id]) {
    cache[id] = info;
    return true;
  }
  return false;
};

const find = ({ id }) => {
  if (!cache[id]) return false;
  return cache[id];
};

const remove = ({ id }) => {
  if (!cache[id]) return false;
  delete cache[id];
  return true;
};

const empty = () => {
  cache = {};
};

const isEmpty = () => {
  throw new Error("Not Programmed.");
};

module.exports = Object.freeze({
  add,
  find,
  remove,
  empty,
  isEmpty,
});
