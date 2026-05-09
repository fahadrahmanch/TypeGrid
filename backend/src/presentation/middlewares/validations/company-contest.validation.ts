import Joi from "joi";

export const companyContestValidation = {
  create: Joi.object({
    contestMode: Joi.string().valid("group", "open").required(),
    title: Joi.string().min(3).required(),
    description: Joi.string().min(10).required(),
    targetGroup: Joi.string().when("contestMode", {
      is: "group",
      then: Joi.string().required(),
      otherwise: Joi.string().optional().allow(""),
    }),
    difficulty: Joi.string().valid("easy", "medium", "hard").required(),
    textSource: Joi.string().valid("manual", "random").required(),
    contestText: Joi.string().when("textSource", {
      is: "manual",
      then: Joi.string().min(10).required(),
      otherwise: Joi.string().optional().allow(""),
    }),
    date: Joi.date().iso().required(),
    duration: Joi.number().min(1).required(),
    startTime: Joi.string().required(),
    maxParticipants: Joi.number().min(1).required(),
    rewards: Joi.array()
      .items(
        Joi.object({
          rank: Joi.number().required(),
          place: Joi.string().optional(),
          type: Joi.string().optional(),
          prize: Joi.alternatives().try(Joi.number(), Joi.string().regex(/^\d+$/)).required(),
        })
      )
      .optional(),
  }),
  update: Joi.object({
    contestMode: Joi.string().valid("group", "open").optional(),
    title: Joi.string().min(3).optional(),
    description: Joi.string().min(10).optional(),
    targetGroup: Joi.string().optional().allow(""),
    difficulty: Joi.string().valid("easy", "medium", "hard").optional(),
    textSource: Joi.string().valid("manual", "random").optional(),
    contestText: Joi.string().min(10).optional().allow(""),
    date: Joi.date().iso().optional(),
    duration: Joi.number().min(1).optional(),
    startTime: Joi.string().optional(),
    maxParticipants: Joi.number().min(1).optional(),
    rewards: Joi.array()
      .items(
        Joi.object({
          rank: Joi.number().required(),
          place: Joi.string().optional(),
          type: Joi.string().optional(),
          prize: Joi.alternatives().try(Joi.number(), Joi.string().regex(/^\d+$/)).required(),
        })
      )
      .optional(),
  }),
};
