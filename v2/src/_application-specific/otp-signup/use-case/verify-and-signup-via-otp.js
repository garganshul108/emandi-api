module.exports = buildVerifyAndSignupViaOTP = ({
  verifyOTP,
  addVendor,
  addUser,
  TypeEnum,
  contactValidator,
  generateAuthToken,
}) => {
  const invalidOTP = ({ type, contact }) => {
    return {
      insertCount: 0,
      message: `Invalid otp for (${type}, ${contact}) pair`,
    };
  };

  return (verifyAndSignupViaOTP = async ({ otp, contact, type }) => {
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
      return invalidOTP({ type, contact });
    }

    let addApplicant = null;
    if (TypeEnum.verify.vendor(type)) {
      addApplicant = addVendor;
    } else if (TypeEnum.verify.user(type)) {
      addApplicant = addUser;
    }

    const inserted = await addApplicant({ contact });

    let tokenPayload = {};
    if (TypeEnum.verify.vendor(type)) {
      tokenPayload.isVendor = true;
      tokenPayload.id = inserted.id;
    } else if (TypeEnum.verify.user(type)) {
      tokenPayload.isUser = true;
      tokenPayload.id = inserted.id;
    }

    const authToken = await generateAuthToken(tokenPayload);
    return {
      insertCount: 1,
      result: inserted,
      authToken: authToken,
    };
  });
};
