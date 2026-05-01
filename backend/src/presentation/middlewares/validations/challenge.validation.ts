import Joi from "joi";

export const challengeValidation = {
  create: Joi.object({
    title: Joi.string().required(),
    difficulty: Joi.string().valid("easy", "medium", "hard").required(),
    goal: Joi.string().hex().length(24).required(),
    reward: Joi.string().hex().length(24).required(),
    duration: Joi.number().min(1).required(),
    description: Joi.string().required(),
  }),
  update: Joi.object({
    title: Joi.string().optional(),
    difficulty: Joi.string().valid("easy", "medium", "hard").optional(),
    goal: Joi.string().hex().length(24).optional(),
    reward: Joi.string().hex().length(24).optional(),
    duration: Joi.number().min(1).optional(),
    description: Joi.string().optional(),
  }),
};
