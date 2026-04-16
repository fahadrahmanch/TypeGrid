import Joi from 'joi';

export const achievementValidation = {
  create: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    imageUrl: Joi.string().optional(),
    minWpm: Joi.number().min(0).optional(),
    minAccuracy: Joi.number().min(0).max(100).optional(),
    minGame: Joi.number().min(0).optional(),
    xp: Joi.number().min(0).optional(),
  }),
  update: Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    imageUrl: Joi.string().optional(),
    minWpm: Joi.number().min(0).optional(),
    minAccuracy: Joi.number().min(0).max(100).optional(),
    minGame: Joi.number().min(0).optional(),
    xp: Joi.number().min(0).optional(),
  }),
};
