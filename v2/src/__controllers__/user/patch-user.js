const makePatchUser = ({ updateUser }) => {
  const patchUser = async (httpRequest) => {
    try {
      const id = httpRequest.params.id;
      const { state_id, city_id, ...userInfo } = httpRequest.body;
      const edited = await updateUser({
        id,
        state: { id: state_id },
        city: { id: city_id },
        ...userInfo,
      });
      return {
        headers: {
          "Content-Type": "application/json",
          "Last-Modified": new Date().toUTCString(),
        },
        statusCode: edited.editCount > 0 ? 201 : 404,
        body: edited.result,
      };
    } catch (e) {
      console.log(e);
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 400,
        body: { error: e.message },
      };
    }
  };

  return patchUser;
};

module.exports = makePatchUser;
