import { IEmailService } from "../../domain/interfaces/services/IEmailService";
import nodemailer , { Transporter }from "nodemailer";
export class EmailService implements IEmailService{
    private transporter:nodemailer.Transporter
    constructor(){
     this.transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    }
    async sentOtp(): Promise<void> {
        
    }
}