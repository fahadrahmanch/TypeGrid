import { IEmailTemplate } from "../emailTemplates/IEmailTemplate";
export interface IEmailService{
    sentOtp(template:IEmailTemplate):Promise<void>
}