import { userAPI } from "../axios/userAPI";
import { SignupData } from "../../types/auth";
import { adminAPI } from "../axios/adminAPI";
import { companyAPI } from "../axios/companyAPI";
interface signInData {
  email: string;
  password: string;
  role: string;
}

//user

export async function signup(data: SignupData) {
  return userAPI.post("/auth/signup", data);
}

export async function verifyOtp(
  otp: string,
  name: string,
  email: string,
  password: string,
) {
  return userAPI.post("/auth/verify-otp", { otp, name, email, password });
}
export async function resentOtp(name: string, email: string) {
  return userAPI.post("/auth/resent-otp", { name, email });
}
export async function signIn(data: signInData) {
  return userAPI.post("/auth/signin", { data });
}
export async function userRefreshAPI() {
  return userAPI.post("/auth/refresh-token");
}
export async function googleAuthApi(data: any) {
  return userAPI.post("/auth/google-login", data);
}
export async function LogoutApi() {
  return userAPI.post("/auth/logout");
}
export async function forgotPasswordApi(email: string) {
  return userAPI.post("/auth/forgot/password", { email });
}
export async function forgotPasswordOtpVerifiction(otp: string, email: string) {
  return userAPI.post("/auth/forgot/password/verify/otp", { otp, email });
}
export async function createNewpasswordApi(email: string, password: string) {
  return userAPI.post("/auth/create/new/password", { email, password });
}

//admin

export async function adminSigninApi(data: signInData) {
  return adminAPI.post("/auth/signin", { data });
}

export async function adminRefreshAPI() {
  return adminAPI.post("/auth/refresh-token");
}


//company
export async function companySignIn(data: any) {
  return companyAPI.post("/auth/signin", { data });
}

export async function companyRefreshAPI() {
  return companyAPI.post("/auth/refresh-token");
}

export async function companyForgotPasswordApi(email: string) {
  return companyAPI.post("/auth/forgot/password", { email });
}

export async function companyForgotPasswordOtpVerifiction(otp: string, email: string) {
  return companyAPI.post("/auth/forgot/password/verify/otp", { otp, email });
}
export async function companyCreateNewpasswordApi(email: string, password: string) {
  return companyAPI.post("/auth/create/new/password", { email, password });
}


