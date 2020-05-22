const makeDeleteUser = ({ removeUser }) => {
  const deleteUser = async (httpRequest) => {
    try {
      const id = httpRequest.actor.user_id;
      const deleted = await removeUser({ id });
      return {
        headers: {
          "Content-Type": "application/json",
          "Last-Modified": new Date().toUTCString(),
        },
        statusCode: deleted.deletedCount > 0 ? 201 : 404,
        body: deleted.message,
      };
    } catch (e) {
      console.log(e);
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 400,
        body: {
          error: e.message,
        },
      };
    }
  };

  return deleteUser;
};

module.exports = makeDeleteUser;
