
import joi from "joi";
export const verifyOtpValidation = joi.object({
    email: joi.string().trim().email().required(),
    otp: joi.string().trim().length(6).required(),
    name:joi.string().optional(),
    password:joi.string().optional()
});

export const resendOtpValidation = joi.object({
    email: joi.string().trim().email().required(),
    name:joi.string().optional()
});