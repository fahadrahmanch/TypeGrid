import Joi from "joi"
export const companyUserValidation = {
    addCompanyUser: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string().required(),
    }),
  
  
}
 