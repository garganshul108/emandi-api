const OTPRegister = require("./OTP-Register");
const SignupOTPRegister = OTPRegister({ name: "Signup Register" });
const LoginOTPRegister = OTPRegister({ name: "Signup Register" });

module.exports = { SignupOTPRegister, LoginOTPRegister };
