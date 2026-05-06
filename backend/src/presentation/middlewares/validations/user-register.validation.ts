
import joi from "joi";

export const userRegisterValidation = joi.object({
  name: joi.string().trim().min(3).max(50).required(),
  email: joi.string().trim().email().required(),
  password: joi.string().trim().min(6).max(100).required(),
  confirmPassword: joi.string().trim().min(6).max(100),
});