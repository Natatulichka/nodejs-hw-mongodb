import Joi from 'joi';

const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
export const contactAddSchema = Joi.object({
  name: Joi.string().min(2).max(20).required().messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username must be',
  }),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().pattern(emailRegexp).min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(20),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().pattern(emailRegexp).min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
  photo: Joi.string().uri().optional(),
});
