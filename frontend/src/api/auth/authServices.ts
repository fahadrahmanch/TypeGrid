import API from "../axios/axios";
import { SignupData } from "../../types/auth";
interface signInData {
    email: string;
    password: string;
}
export async function signup(data: SignupData) {
    return API.post("/signup", data);
}
export async function verifyOtp(otp: string, name: string, email: string, password: string) {
    return API.post("/verify-otp", { otp, name, email, password });
}
export async function resentOtp(name: string, email: string) {
    return API.post("/resent-otp", { name, email });
}
export async function signIn(data: signInData) {
    return API.post("/signin", { data });
}
export async function refreshAPI() {
    return API.post("/refresh-token");
}
export async function googleAuthApi(data: any) {
    return API.post("/google-login",data);
}
export async function LogoutApi(){
    return API.post('/logout')
}
export async function forgotPasswordApi(email:string){
    return API.post("/forgot/password",{email})
}
export async function forgotPasswordOtpVerifiction(otp:string,email:string){
    return API.post('/forgot/password/verify/otp',{otp,email})
}
export async function createNewpasswordApi(email:string,password:string){
    return API.post('/create/new/password',{email,password})
}