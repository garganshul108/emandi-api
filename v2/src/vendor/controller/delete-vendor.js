module.exports = function makeDeleteVendor({ removeVendor }) {
  return async function deleteVendor(httpRequest) {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const deleted = await removeVendor({ id: httpRequest.actor.id });
      return {
        headers,
        statusCode: 200,
        body: { result: deleted },
      };
    } catch (e) {
      // TODO: Error logging
      console.log(e);
      return {
        headers,
        statusCode: 400,
        body: {
          error: e.message,
        },
      };
    }
  };
};
