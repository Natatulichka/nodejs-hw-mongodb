import Joi from 'joi';

export const contactAddSchema = Joi.object({
  name: Joi.string().min(2).max(20).required().messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username must be',
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+380\d{9}$/)
    .messages({ 'string.pattern.base': `Phone number must have 9 digits.` })
    .required(),
  email: Joi.string().email().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(20),
  phoneNumber: Joi.string().pattern(/^\+380\d{9}$/),
  email: Joi.string().email().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
});
