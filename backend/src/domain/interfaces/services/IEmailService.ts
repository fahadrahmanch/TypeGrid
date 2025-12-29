import { IEmailTemplate } from "../emailTemplates/IEmailTemplate";
import nodemailer from "nodemailer";
export interface IEmailService{
    sentOtp(template:IEmailTemplate):Promise<void>
    sendMail(mailOptions:nodemailer.SendMailOptions): Promise<void>;
}