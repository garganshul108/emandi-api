const makeDeleteAdmin = ({ removeAdmin }) => {
  const deleteAdmin = async (httpRequest) => {
    try {
      const { username } = httpRequest.params;
      const deleted = await removeAdmin({ username });
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
  return deleteAdmin;
};
module.exports = makeDeleteAdmin;
