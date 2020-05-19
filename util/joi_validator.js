const Joi = require("@hapi/joi");

const defaultSchema = {
  city_id: Joi.number().min(1),
  state_id: Joi.number().min(1),
  vendor_id: Joi.number().min(1),
  order_id: Joi.number().min(1),
  item_id: Joi.number().min(1),

  item_qty: Joi.number(),

  username: Joi.string().min(3),
  password: Joi.string().min(3),

  contact: Joi.number(),
  device_fcm_token: Joi.string(),

  delivery_address: Joi.string().min(3),
  pincode: Joi.number(),

  crop_qty: Joi.number(),
  crop_name: Joi.string().min(3),
  crop_type_id: Joi.number(),
  crop_price: Joi.number(),

  packed_timestamp: Joi.string(),
  exp_timestamp: Joi.string(),
  description: Joi.string(),

  type: Joi.string().valid("vendor", "admin", "user"),
  crop_class: Joi.string().valid("FRUITS", "GRAINS", "VEGETABLES", "OTHER"),
  crop_type_name: Joi.string().min(3),
  name: Joi.string().min(3),
};

const joiValidator = (pairs) => {
  for (let pair of pairs) {
    for (let key in pair.object) {
      if (!pair.schema[key]) {
        pair.schema[key] = Joi.any();
      }
    }
    pair.schema = Joi.object(pair.schema);
  }

  let result = {};
  for (let pair of pairs) {
    const { error: err, value } = pair.schema.validate(pair.object);
    if (err) {
      console.log("Invalid Request Format\n", err);
      let errorList = [];
      for (let i = 0; i < err.details.length; i++) {
        errorList.push(`${i + 1}. ${err.details[i].message}`);
      }
      errorList = errorList.join("\n");

      return { status: false, error: err, optionals: { errorList } };
    }
    result = { ...result, ...value };
  }

  return { status: true, value: result, error: undefined };
};

module.exports = { joiValidator, defaultSchema };
