import joi from "joi";

export const createCompanyGroup = joi.object({
  groupName: joi.string().trim().min(3).max(50).required(),
  groupType: joi.string().valid("beginner", "intermediate", "advanced").required(),
  groupingMethod: joi.string().valid("auto", "manual").optional(),

  // For Auto grouping
  minWpm: joi.alternatives().try(joi.string(), joi.number()).optional().allow("", null),
  maxWpm: joi.alternatives().try(joi.string(), joi.number()).optional().allow("", null),
  minAccuracy: joi.alternatives().try(joi.string(), joi.number()).optional().allow("", null),
  maxAccuracy: joi.alternatives().try(joi.string(), joi.number()).optional().allow("", null),

  // For Manual grouping
  selectedUsers: joi.array().items(joi.string().trim()).optional().allow(null),
});
