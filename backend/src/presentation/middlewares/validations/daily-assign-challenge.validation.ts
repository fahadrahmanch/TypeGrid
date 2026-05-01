import Joi from "joi";

export const dailyAssignChallengeValidation = {
  create: Joi.object({
    challengeId: Joi.string().hex().length(24).required(),
    date: Joi.date().required(),
  }),
  update: Joi.object({
    challengeId: Joi.string().hex().length(24).optional(),
    date: Joi.date().optional(),
  }),
};
