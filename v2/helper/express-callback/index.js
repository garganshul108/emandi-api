module.exports = function makeExpressCallback(controller) {
  return async (req, res) => {
    const httpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      headers: {
        "Content-Type": req.get("Content-Type"),
        Referer: req.get("referer"),
        "User-Agent": req.get("User-Agent"),
      },
    };

    if (req.actor) {
      httpRequest.actor = req.actor;
    }
    try {
      const httpResponse = await controller(httpRequest);

      if (httpResponse.headers) {
        res.set(httpResponse.headers);
      }
      res.type("json");
      return res.status(httpResponse.statusCode).send(httpResponse.body);
    } catch (e) {
      return res.status(500).send({ error: "An unknown error occured." });
    }
  };
};
