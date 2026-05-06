import joi from "joi";

export const subscriptionPlanValidation = joi.object({
  data: joi.object({
    id: joi.string().optional(),
    name: joi.string().trim().required(),
    price: joi.alternatives().try(joi.string(), joi.number()).required(),
    duration: joi.alternatives().try(joi.string(), joi.number()).required(),
    type: joi.string().valid("normal", "company").required(),
    features: joi.array().items(joi.string().trim()).when("type", {
      is: "normal",
      then: joi.array().min(1).required(),
      otherwise: joi.array().optional().allow(null),
    }),
    userLimit: joi.alternatives().try(joi.string(), joi.number()).when("type", {
      is: "company",
      then: joi.required(),
      otherwise: joi.optional().allow(null, "", 0),
    }),
    createdAt: joi.any().optional(),
    updatedAt: joi.any().optional(),
  }),
});
