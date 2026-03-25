import Joi from "joi";

export const createRewardSchema = Joi.object({
  xp: Joi.number().integer().min(1).required(),
  description: Joi.string().trim().min(3).max(200).required(),
});

export const updateRewardSchema = Joi.object({
  xp: Joi.number().integer().min(1),
  description: Joi.string().trim().min(3).max(200),
}).min(1);