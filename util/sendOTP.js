const unirest = require("unirest");
const config = require("config");
const SMS_APIKEY = config.get("sms-apikey");

const sendOTP = (contact, otp_template_id, template_variables) => {
  if (typeof contact !== "string") {
    contact = contact.toString();
  }
  if (typeof otp_template_id !== "string") {
    otp_template_id = otp_template_id.toString();
  }
  const otpTemplate = config.get(otp_template_id);
  const template_id = otpTemplate["template-id"];
  const template_variable_order = otpTemplate["template-variable-order"];
  if (typeof template_id !== "string") {
    template_id = template_id.toString();
  }
  if (typeof template_variable_order !== "string") {
    throw new Error("template_variable_order is not 'string'");
  }
  if (typeof template_variables !== "string") {
    throw new Error("template_variable is not 'string'");
  }

  let req = unirest("POST", "https://www.fast2sms.com/dev/bulk");

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
    message: template_id,
    variables: template_variable_order,
    variables_values: template_variables,
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

module.exports = sendOTP;
