const makePostLoginAdmin = ({ loginAdmin }) => {
  const postLoginAdmin = async (httpRequest) => {
    try {
      const { username, password } = httpRequest.body;

      const loggedin = await loginAdmin({
        username,
        password,
      });

      if (!loggedin.foundCount || loggedin.foundCount === 0) {
        return {
          headers: {
            "Content-Type": "application/json",
            "Last-Modified": new Date().toUTCString(),
          },
          statusCode: 201,
          body: loggedin.message,
        };
      }
      if (!loggedin.valid) {
        return {
          headers: {
            "Content-Type": "application/json",
            "Last-Modified": new Date().toUTCString(),
          },
          statusCode: 403,
          body: loggedin.message,
        };
      }
      return {
        headers: {
          "Content-Type": "application/json",
          "Last-Modified": new Date().toUTCString(),
        },
        statusCode: 201,
        body: loggedin.result,
      };
    } catch (e) {
      // TODO: Error logging
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
  return postLoginAdmin;
};
module.exports = makePostLoginAdmin;
