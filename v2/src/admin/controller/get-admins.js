const makeGetAdmins = ({ listAdmins }) => {
  const getAdmins = (httpRequest) => {
    try {
      const { username } = httpRequest.query;
      const list = null;
      if (username) {
        list = listAdmins({ username });
      } else {
        list = listAdmins();
      }

      return {
        headers: {
          "Content-Type": "application/json",
          "Last-Modified": new Date().toUTCString(),
        },
        statusCode: 200,
        body: list.result,
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
  return getAdmins;
};
module.exports = makeGetAdmins;
