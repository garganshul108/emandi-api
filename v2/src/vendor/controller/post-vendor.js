export default function makePostVendor({ addVendor }) {
  return async function postVendor(httpRequest) {
    try {
      const vendorInfo = { ...httpRequest.body };

      const posted = await addVendor({
        ...vendorInfo,
      });
      return {
        headers: {
          "Content-Type": "application/json",
          "Last-Modified": new Date().toUTCString(),
        },
        statusCode: 201,
        body: { result: posted },
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
}
