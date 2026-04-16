import Joi from 'joi';

export const createGoalSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required(),
  wpm: Joi.number().integer().min(1).required(),
  accuracy: Joi.number().integer().min(1).required(),
  description: Joi.string().trim().min(3).max(200).required(),
});

export const updateGoalSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100),
  wpm: Joi.number().integer().min(1),
  accuracy: Joi.number().integer().min(1),
  description: Joi.string().trim().min(3).max(200),
});
