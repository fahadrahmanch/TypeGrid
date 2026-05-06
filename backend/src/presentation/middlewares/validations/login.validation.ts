import joi from "joi";
export const loginValidation = joi.object({
  data: joi.object().keys({
    email: joi.string().trim().email().required(),
    password: joi.string().trim().required(),
    role: joi.string().optional(),
  }),
});