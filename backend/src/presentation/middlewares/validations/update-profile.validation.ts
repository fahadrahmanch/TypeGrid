import joi from "joi";

export const updateProfileValidation = joi.object({
  data: joi.object({
    name: joi.string().trim().min(3).max(50).optional(),
    email: joi.string().trim().email().optional(),
    bio: joi.string().trim().min(10).max(200).allow("").optional(),
    age: joi.alternatives().try(joi.number().min(9).max(100), joi.string().trim()).allow(null, "").optional(),
    number: joi.alternatives().try(joi.string().trim().pattern(/^[6-9]\d{9}$/), joi.number()).allow("").optional(),
    gender: joi.string().valid("Male", "Female", "Other", "", null).optional(),
    imageUrl: joi.string().trim().uri().allow("").optional(),
  }),
});
