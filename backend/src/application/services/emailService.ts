import { IEmailService } from "../../domain/interfaces/services/IEmailService";
import nodemailer from "nodemailer";
import { IEmailTemplate } from "../DTOs/email/EmailTemplateDto";
import { HtmlforOtp } from "../../infrastructure/email/templates/otpMailHtml";
import dotenv from "dotenv";
import logger from "../../utils/logger";
dotenv.config();
export class EmailService implements IEmailService{
    private _transporter:nodemailer.Transporter;
    constructor(){
     this._transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", 
      port: 465,             
      secure: true,  
      
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },

    });
     this._transporter.verify()
      .then(() => logger.info(" Mail transporter connected successfully"))
      .catch(err => logger.error(" Mail transporter connection failed:", err));
  }

  async sendMail(mailOptions:nodemailer.SendMailOptions): Promise<void> {
    await this._transporter.sendMail(mailOptions);
  }
  
  async sentOtp(template:IEmailTemplate): Promise<void> {
    
    const html=await HtmlforOtp(template.name,template.otp,template.body??"");
      
      const mailOptions:nodemailer.SendMailOptions={
        from:process.env.EMAIL_USER,
        to:template.email,
        subject:template.subject,
        html
      };
      await this._transporter.sendMail(mailOptions);
    }
}





