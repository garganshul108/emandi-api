const makeVerifyAndSignupViaOTP = require("./verify-and-signup-via-otp");
const makeGenerateSignupOTP = require("./generate-signup-otp");
const OTPService = require("../../../../third-party-services/otp-service");
const OTPRegisterationService = require("../../../../custom-services/otp-registering-service");
const TokenService = require("../../../../custom-services/token-service");

const { addUser } = require("../../../user/use-case");
const { addVendor } = require("../../../vendor/use-case");
const TypeEnum = require("../../type-enum");
const sendOTP = async ({ contact, otp }) => {
  await OTPService.send(otp, contact);
};

const registerOTP = async ({ otp, contact, type }) => {
  await OTPRegisterationService.register({ otp, contact, type });
};

const verifyOTP = async ({ otp, contact, type }) => {
  const valid = await OTPRegisterationService.verify({ otp, contact, type });
  return valid;
};

const generateAuthToken = (payload) => {
  return TokenService.generateToken(payload);
};

const contactValidator = (contact) => true;

const verifyAndSignupViaOTP = makeVerifyAndSignupViaOTP({
  verifyOTP,
  addUser,
  addVendor,
  TypeEnum,
  contactValidator,
  generateAuthToken,
});
const generateSignupOTP = makeGenerateSignupOTP({
  contactValidator,
  TypeEnum,
  registerOTP,
  listUsers,
  listVendors,
  sendOTP,
});

module.exports = {
  verifyAndSignupViaOTP,
  generateSignupOTP,
};
