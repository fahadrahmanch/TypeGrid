import API from "../axios/axios";
import { SignupData } from "../../types/auth";
export async function signup(data:SignupData){
    return API.post("/signup",data);
}
export async function verifyOtp(otp:string,name:string,email:string,password:string){
return API.post("/verify-otp",{otp,name,email,password});
}
export async function resentOtp(name:string,email:string){
    return API.post('/resent-otp',{name, email})
}