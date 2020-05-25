const buildFast2SMSOTPService = require("./fast2sms-otp-service");

const unirest = require("unirest");
const config = require("config");

const SMS_APIKEY = config.get("sms-apikey");
const otpTemplate = config.get("otp-template-2");
const TEMPLATE_ID = otpTemplate["template-id"];
const TEMPLATE_VARIBLE_ORDER = otpTemplate["template-variable-order"];
const templateGenerator = eval(otpTemplate["template-generator"]);

const OTPService = buildFast2SMSOTPService({
  proxy: unirest,
  SMS_APIKEY,
  TEMPLATE_ID,
  templateGenerator,
  TEMPLATE_VARIBLE_ORDER,
});

const send = OTPService.send;

module.exports = {
  send,
};
