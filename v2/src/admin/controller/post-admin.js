const makePostAdmin = ({ addAdmin }) => {
  const postAdmin = async (httpRequest) => {
    try {
      const adminInfo = { ...httpRequest.body };

      const posted = await addAdmin({
        ...adminInfo,
      });

      return {
        headers: {
          "Content-Type": "application/json",
          "Last-Modified": new Date().toUTCString(),
        },
        statusCode: 201,
        body: posted.result,
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

  return postAdmin;
};
module.exports = makePostAdmin;
