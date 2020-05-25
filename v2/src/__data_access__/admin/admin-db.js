const makeAdminDb = ({ makeDb }) => {
  const findByUsername = (username) => {
    return {};
  };

  const findAll = ({}) => {
    return {};
  };

  const removeByUsername = () => {
    return {};
  };

  const insert = ({}) => {
    return {};
  };

  return Object.freeze({
    findByUsername,
    findAll,
    removeByUsername,
    insert,
  });
};

module.exports = makeAdminDb;
