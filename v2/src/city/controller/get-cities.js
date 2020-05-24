//module.exports = makeGetCities = ({ listCities }) => {
  return (getCities = async (httpRequest) => {
    try {
      const { ...options  } = httpRequest.query;
      const deleted = await listCities(options);
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
  });
};
