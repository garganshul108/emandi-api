export default function makePatchVendor({ editVendor }) {
  return async function patchVendor(httpRequest) {
    try {
      const { ...vendorInfo } = httpRequest.body;
      const toEdit = {
        ...vendorInfo,
        id: httpRequest.actor.id,
      };
      const patched = await editVendor(toEdit);
      return {
        headers: {
          "Content-Type": "application/json",
          "Last-Modified": new Date().toUTCString(),
        },
        statusCode: 200,
        body: { result: patched },
      };
    } catch (e) {
      // TODO: Error logging
      console.log(e);
      if (e.name === "RangeError") {
        return {
          headers: {
            "Content-Type": "application/json",
          },
          statusCode: 404,
          body: {
            error: e.message,
          },
        };
      }
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
