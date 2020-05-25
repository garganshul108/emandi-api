const buildMakeAdmin = ({ sanitize }) => {
  const makeAdmin = ({ username, password }) => {
    if (username) {
      username = sanitize(username);
    }
    if (password) {
      password = sanitize(password);
    }

    return Object.freeze({
      getUsername: () => username,
      getPassword: () => password,
    });
  };

  return makeAdmin;
};

module.exports = buildMakeAdmin;
