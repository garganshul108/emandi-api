const buildFast2SMSOTPService = ({
  proxy,
  SMS_APIKEY,
  TEMPLATE_ID,
  templateGenerator,
  TEMPLATE_VARIBLE_ORDER,
}) => {
  const send = ({ contact, otp }) => {
    let req = proxy("POST", "https://www.fast2sms.com/dev/bulk");
    let templateVariables = templateGenerator({ contact, otp });
    if (typeof contact !== "string") {
      contact = contact.toString();
    }

    req.headers({
      "content-type": "application/x-www-form-urlencoded",
      "cache-control": "no-cache",
      authorization: SMS_APIKEY,
    });

    req.form({
      sender_id: "FSTSMS",
      language: "english",
      route: "qt",
      numbers: contact,
      message: TEMPLATE_ID,
      variables: TEMPLATE_VARIBLE_ORDER,
      variables_values: templateVariables,
    });

    return new Promise((resolve, reject) => {
      req.end((res) => {
        if (res.error) {
          reject(res.error);
        } else {
          resolve(res.body);
        }
      });
    });
  };

  return Object.freeze({
    send,
  });
};

module.exports = buildFast2SMSOTPService;
