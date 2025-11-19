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