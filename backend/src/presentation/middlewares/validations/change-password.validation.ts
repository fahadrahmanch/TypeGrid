import joi from "joi";

export const changePasswordValidation = joi.object({
  currentPassword: joi.string().trim().required(),
  newPassword: joi.string().trim().min(6).max(100).required(),
});
