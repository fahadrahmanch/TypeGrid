import joi from "joi";

export const verifyCompanyValidation = joi.object({
  companyName: joi.string().trim().min(3).max(100).required(),
  address: joi.string().trim().min(5).max(200).required(),
  email: joi.string().trim().email().required(),
  number: joi.string().trim().pattern(/^[6-9]\d{9}$/).required(),
  document: joi.string().trim().uri().required(),
  planId: joi.string().optional(),
});
