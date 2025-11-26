import { userAPI } from "../axios/userAPI";
import { SignupData } from "../../types/auth";
interface signInData {
    email: string;
    password: string;
    role:string;
}


//user

export async function signup(data: SignupData) {
    return userAPI.post("/signup", data);
}
export async function verifyOtp(otp: string, name: string, email: string, password: string) {
    return userAPI.post("/verify-otp", { otp, name, email, password });
}
export async function resentOtp(name: string, email: string) {
    return userAPI.post("/resent-otp", { name, email });
}
export async function signIn(data: signInData) {
    return userAPI.post("/signin", { data });
}
export async function refreshAPI() {
    return userAPI.post("/refresh-token");
}
export async function googleAuthApi(data: any) {
    return userAPI.post("/google-login",data);
}
export async function LogoutApi(){
    return userAPI.post("/logout");
}
export async function forgotPasswordApi(email:string){
    return userAPI.post("/forgot/password",{email});
}
export async function forgotPasswordOtpVerifiction(otp:string,email:string){
    return userAPI.post("/forgot/password/verify/otp",{otp,email});
}
export async function createNewpasswordApi(email:string,password:string){
    return userAPI.post("/create/new/password",{email,password});
}


//admin

export async function adminSiginApi(data:signInData){
    // return API.post("/admin/signin",{data});
}