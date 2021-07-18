const OTPRegister = ({ name }) => {
  let otps = [];

  const getName = () => name;

  const register = ({ otp, contact, type }) => {
    otps.push({ otp, contact, type });
  };

  const verify = ({ otp, contact, type }) => {
    let newOtps = [];
    let found = null;
    for (let entry of otps) {
      if (
        entry.otp === otp &&
        entry.contact === contact &&
        entry.type === type
      ) {
        found = { ...entry };
        continue;
      }
      newOtps.push({ ...entry });
    }

    return found;
  };

  return Object.freeze({
    verify,
    register,
    getName,
  });
};

module.exports = OTPRegister;
