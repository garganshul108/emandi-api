const buildMakeAdmin = ({ sanitize }) => {
  const makeAdmin = ({ username, password }) => {
    if (!username) {
      throw new Error("Admin's username must be provided.");
    }

    if (!password) {
      throw new Error("Admin must set a password.");
    }

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
