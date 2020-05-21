const clone = (object) => {
  let cloned = undefined;
  if (typeof object === "object") {
    if (Array.isArray(object)) {
      cloned = cloneArray(object);
    } else {
      cloned = cloneObject(object);
    }
  } else {
    cloned = clonePrimitive(object);
  }
  return cloned;
};

const cloneObject = (object) => {
  let clonedObject = {};
  for (let key in object) {
    clonedObject[key] = clone(object[key]);
  }
  return clonedObject;
};

const cloneArray = (array) => {
  let clonedArray = [];
  for (let key in array) {
    clonedArray.push(clone(array[key]));
  }
  return clonedArray;
};

const clonePrimitive = (prime) => {
  return prime;
};

module.exports = clone;
