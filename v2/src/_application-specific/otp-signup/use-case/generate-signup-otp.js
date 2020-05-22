const makeGenerateSignupOTP = ({
  registerOTP,
  contactValidator,
  listUsers,
  listVendors,
  TypeEnum,
  sendOTP,
  OTPRegister
}) => {
  const generateSignupOTP = ({ type, contact }) => {
    if (!type) {
      throw new Error("'type' not provided");
    }
    if (!TypeEnum.valid(type)) {
      throw new Error("Invalid 'type' provided");
    }
    if (!contact) {
      throw new Error("'contact' not provided");
    }
    if (!contactValidator.valid(contact)) {
      throw new Error("Invalid 'contact' provided");
    }

    let listApplicants = null;
    if (TypeEnum.verify.vendor(type)) {
      listApplicants = listVendors;
    } else if (TypeEnum.verify.user(type)) {
      listApplicants = listUsers;
    }

    const existing = listApplicants({ contact });
    if (existing) {
      return alreadyExists({ type, contact });
    }

    const otp = otpGenerator();
    await sendOTP({otp, contact});
    await registerOTP({otp, contact, type});
    
    return {
      foundCount: 0,
      message: "OTP generated and sent successfully",
    };
  };

  const alreadyExists = ({ type, contact }) => {
    return {
      foundCount: 1,
      message: `Already exists as ${type} via ${contact}`,
    };
  };

  return generateSignupOTP;
};

module.exports = makeGenerateSignupOTP;
