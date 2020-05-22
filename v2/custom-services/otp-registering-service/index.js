let otps = [];

const register = ({ otp, contact, type }) => {
  otps.push({ otp, contact, type });
};

const verify = ({ otp, contact, type }) => {
  let newOtps = [];
  let found = false;
  for (let entry of otps) {
    if (entry.otp === otp && entry.contact === contact && entry.type === type) {
      found = true;
      continue;
    }
    newOtps.push({ ...entry });
  }

  return found;
};

module.exports = Object.freeze({
  verify,
  register,
});
