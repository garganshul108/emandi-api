const makeAdminDb = ({ makeDb }) => {
  return Object.freeze({
    findByUsername,
    findAll,
    removeByUsername,
    insert,
  });

  const findByUsername = (username) => {
    const db = makeDb();
  };

  return adminDb;
};

module.exports = makeAdminDb;
