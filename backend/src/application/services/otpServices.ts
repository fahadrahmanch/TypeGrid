import { IOtpService } from "../../domain/interfaces/services/IOtpService"
export class OtpService implements IOtpService{
    constructor(
    ){
    
    }
    async createOtp():Promise<string>{
        let otp=''
        for(let i=0;i<6;i++){
            const randomIndex=Math.floor(Math.random()*9)
            otp+=randomIndex
        }
        return otp
    }
}