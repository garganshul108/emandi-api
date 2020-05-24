module.exports = buildVerifyAndLoginViaOTP = ({
  verifyOTP,
  TypeEnum,
  contactValidator,
  generateAuthToken,
}) => {
  const otpNotRegistered = ({ type, contact }) => {
    return {
      foundCount: 0,
      message: `No otp found for (${type}, ${contact}) pair`,
    };
  };
  const invalidOTP = ({ type, contact }) => {
    return {
      foundCount: 0,
      valid: 0,
      message: `Invalid otp for (${type}, ${contact}) pair`,
    };
  };

  return (verifyAndLoginViaOTP = async ({ otp, contact, type }) => {
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

    const valid = await verifyOTP({ contact, type, otp });
    if (!valid) {
      return otpNotRegistered({ type, contact });
    }

    if (valid.otp !== otp) {
      return invalidOTP({ type, contact });
    }

    let tokenPayload = {};
    if (TypeEnum.verify.vendor(type)) {
      tokenPayload.isVendor = true;
      tokenPayload.id = valid.id;
    } else if (TypeEnum.verify.user(type)) {
      tokenPayload.isUser = true;
      tokenPayload.id = valid.id;
    }

    const authToken = await generateAuthToken(tokenPayload);
    return {
      foundCount: 1,
      valid: 1,
      message: `Login Successful as ${type} via ${contact}`,
      authToken: authToken,
    };
  });
};
