const makeGenerateLoginOTP = ({
  registerOTP,
  contactValidator,
  listUsers,
  listVendors,
  TypeEnum,
  sendOTP,
}) => {
  const generateLoginOTP = async ({ type, contact }) => {
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

    const existing = (await listApplicants({ contact }))[0];
    if (!existing) {
      return doesNotExists({ type, contact });
    }

    const idKey = TypeEnum.verify.vendor(type)
      ? "vendor_id"
      : TypeEnum.verify.user(type)
      ? "user_id"
      : "null";

    const otp = otpGenerator();
    await sendOTP({ otp, contact });
    await registerOTP({ otp, contact, type, id: existing[idKey] });

    return {
      foundCount: 1,
      message: "OTP generated and sent successfully",
    };
  };

  const doesNotExists = ({ type, contact }) => {
    return {
      foundCount: 0,
      message: `Does not exists as ${type} via ${contact}`,
    };
  };

  return generateLoginOTP;
};

module.exports = makeGenerateLoginOTP;
