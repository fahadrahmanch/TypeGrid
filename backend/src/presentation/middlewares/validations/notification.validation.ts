import joi from "joi";

export const individualNotificationValidation = joi.object({
  title: joi.string().trim().min(3).max(100).required(),
  message: joi.string().trim().min(3).max(500).required(),
  selectedUsers: joi.array().items(joi.string().trim().required()).min(1).required(),
});

export const groupNotificationValidation = joi.object({
  title: joi.string().trim().min(3).max(100).required(),
  message: joi.string().trim().min(3).max(500).required(),
  selectedGroup: joi.string().trim().required(),
});

export const allNotificationValidation = joi.object({
  title: joi.string().trim().min(3).max(100).required(),
  message: joi.string().trim().min(3).max(500).required(),
});
