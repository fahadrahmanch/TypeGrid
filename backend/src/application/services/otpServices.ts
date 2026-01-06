import { IOtpService } from "../../domain/interfaces/services/IOtpService";
import { ICachingService } from "../../domain/interfaces/services/ICachingService";
export class OtpService implements IOtpService{
    constructor(
        private _cachingService:ICachingService
    ){
    
    }
    createOtp(email:string):string{
        let otp="";
        for(let i=0;i<6;i++){
            const randomIndex=Math.floor(Math.random()*9);
            otp+=randomIndex;
        }
        console.log("otp",otp);
        this.storeOtp(otp,email);
        return otp;
    }
    storeOtp(otp:String,email:String):void{
           this._cachingService.setData(`user-otp-${email}`, otp, 300);
     }
    verifyOtp(otp:string,email:string):Boolean{
            return this._cachingService.getData(`user-otp-${email}`) === otp;
        }
}