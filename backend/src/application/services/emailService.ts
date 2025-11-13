import { IEmailService } from "../../domain/interfaces/services/IEmailService";
import nodemailer , { Transporter }from "nodemailer";
import { IEmailTemplate } from "../../domain/interfaces/emailTemplates/IEmailTemplate";
import { HtmlforOtp } from "../../domain/constants/otpMailHtml";
import dotenv from "dotenv";
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
      .then(() => console.log(" Mail transporter connected successfully"))
      .catch(err => console.error(" Mail transporter connection failed:", err));
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