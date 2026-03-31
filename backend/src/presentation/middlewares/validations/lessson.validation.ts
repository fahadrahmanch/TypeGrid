import Joi from "joi";

export const lessonValidation = {
    createLesson: Joi.object({
        title: Joi.string().required(),
        text: Joi.string().required(),
        category: Joi.string().required(),
        level: Joi.string().required(),
        wpm: Joi.string().required(),
        accuracy: Joi.string().required(),
    }),
    updateLesson: Joi.object({
        id: Joi.string(),
        title: Joi.string(),
        text: Joi.string(),
        category: Joi.string(),
        level: Joi.string(),
        wpm: Joi.number(),
        accuracy: Joi.string(),
    }),
   
}        
