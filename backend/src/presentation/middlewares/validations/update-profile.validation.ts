import joi from "joi";

export const updateProfileValidation = joi.object({
  data: joi.object({
    name: joi.string().trim().min(3).max(50).optional(),
    email: joi.string().trim().email().optional(),
    bio: joi.string().trim().min(10).max(200).allow("").optional(),
    age: joi.number().min(9).max(100).allow(null, "").optional(),
    number: joi.string().trim().pattern(/^[6-9]\d{9}$/).allow("").optional(),
    gender: joi.string().valid("Male", "Female", "Other").optional(), // Match frontend case
    imageUrl: joi.string().trim().uri().allow("").optional(),
  }),
});
