const makeGetUsersMe = ({ listUsers }) => {
  const getUsersMe = async (httpRequest) => {
    try {
      const id = httpRequest.actor.user_id;
      const fetched = await listUsers({ id });

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

  return getUsersMe;
};

module.exports = makeGetUsersMe;
