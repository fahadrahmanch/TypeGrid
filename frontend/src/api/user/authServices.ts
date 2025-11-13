import API from "../axios/axios";
import { SignupData } from "../../types/auth";
export async function signup(data:SignupData){
    console.log("dh");
    return API.post("/signup",data);
}
export async function verifyOtp(otp:string,email:string){
return API.post("/verify-otp",{otp,email});
}