export default function makeGetVendor({ listVendors }) {
  return async function getVendor(httpRequest) {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const results = await listVendors();
      return {
        headers,
        statusCode: 200,
        body: {
          result: results,
        },
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
}
