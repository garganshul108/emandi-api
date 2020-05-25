const makeGetUsers = ({ listUsers }) => {
  const getUsers = async (httpRequest) => {
    try {
      let fetched = null;
      if (httpRequest.params.id) {
        const id = httpRequest.params.id;
        fetched = await listUsers({ id });
      } else {
        etched = await listUsers();
      }
      return {
        headers: {
          "Content-Type": "application/json",
          "Last-Modified": new Date().toUTCString(),
        },
        statusCode: fetched.foundCount > 0 ? 200 : 404,
        body: fetched.result,
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

  return getUsers;
};

module.exports = makeGetUsers;
