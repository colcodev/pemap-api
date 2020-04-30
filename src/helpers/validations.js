import { Joi } from 'express-validation';

const authHeaderValidation = {
  headers: Joi.object({
    authorization: Joi.string().required(),
  }).options({ allowUnknown: true }),
};

const getUserToken = {
  ...authHeaderValidation,
  query: Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const getAccountInfo = {
  ...authHeaderValidation,
};

const getRestaurants = {
  ...authHeaderValidation,
  query: Joi.object({
    country: Joi.number().required(),
    point: Joi.string().required(),
  }),
};

const getStats = {
  ...authHeaderValidation,
};

export default {
  getUserToken,
  getAccountInfo,
  getRestaurants,
  getStats,
};
