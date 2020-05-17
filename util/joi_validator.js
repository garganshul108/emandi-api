const Joi = require("@hapi/joi");

const defaultSchema = {
  city_id: Joi.number(),
  state_id: Joi.number(),
  crop_class: Joi.string()
    .valid("FRUITS", "GRAINS", "VEGETABLES", "OTHER")
    .default("OTHER"),
  vendor_id: Joi.number(),
  crop_type_name: Joi.string().min(3),
};

const joiValidator = (pairs) => {
  for (let pair of pairs) {
    pair.schema = Joi.object(pair.schema);
  }

  for (let pair of pairs) {
    const { error: err } = pair.schema.validate(pair.object);
    if (err) {
      console.log("Invalid Request Format\n", err);
      let errorList = [];
      for (let i = 0; i < err.details.length; i++) {
        errorList.push(`${i + 1}. ${err.details[i].message}`);
      }
      errorList = errorList.join("\n");

      return { status: false, error: err, optionals: { errorList } };
    }
  }

  return { status: true, error: undefined };
};

module.exports = { joiValidator, defaultSchema };
