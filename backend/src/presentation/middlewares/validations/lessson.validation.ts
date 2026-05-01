import Joi from "joi";

export const lessonValidation = {
  createLesson: Joi.object({
    title: Joi.string().required(),
    text: Joi.string().required(),
    category: Joi.string().required(),
    level: Joi.string().required(),

    wpm: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
    accuracy: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  }),
  updateLesson: Joi.object({
    id: Joi.string(),
    title: Joi.string(),
    text: Joi.string(),
    category: Joi.string(),
    level: Joi.string(),

    wpm: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
    accuracy: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  }),
};
