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

// signup
export async function signup(data: SignupData){
  return userAPI.post("/auth/signup",  data);
}
// verify OTP (after signup)
export async function verifyOtp(
  otp: string,
  name: string,
  email: string,
  password: string
) {
  return userAPI.post("/auth/otp/verify", {
    otp,
    name,
    email,
    password,
  });
}

// resend OTP
export async function resendOtp(name: string, email: string) {
  return userAPI.post("/auth/otp/resend", { name, email });
}

// signin
export async function signIn(data: signInData) {
  return userAPI.post("/auth/signin", {data}); 
}

// refresh token
export async function userRefreshAPI() {
  return userAPI.post("/auth/refresh-token");
}

// google auth
export async function googleAuthApi(data: any) {
  return userAPI.post("/auth/google", data);
}

// logout
export async function logoutApi() {
  return userAPI.post("/auth/logout");
}

// forgot password (send OTP)
export async function forgotPasswordApi(email: string) {
  return userAPI.post("/auth/password/forgot", { email });
}

// verify forgot-password OTP
export async function forgotPasswordOtpVerification(
  otp: string,
  email: string
) {
  return userAPI.post("/auth/password/otp/verify", { otp, email });
}

// reset password 
export async function resetPasswordApi(
  email: string,
  newPassword: string
) {
  return userAPI.post("/auth/password/reset", {
    email,
    password: newPassword,
  });
}


//admin

export async function adminSigninApi(data: signInData) {
  return adminAPI.post("/auth/signin", {data}); 
}

// admin refresh token
export async function adminRefreshAPI() {
  return adminAPI.post("/auth/refresh-token");
}

// admin logout
export async function adminLogoutApi() {
  return adminAPI.post("/auth/logout");
}


// company signin
export async function companySignIn(data: any) {
  return companyAPI.post("/auth/signin", {data});
}

// company refresh token
export async function companyRefreshAPI() {
  return companyAPI.post("/auth/refresh-token");
}

// forgot password (send OTP)
export async function companyForgotPasswordApi(email: string) {
  return companyAPI.post("/auth/password/forgot", { email });
}

// verify forgot-password OTP
export async function companyForgotPasswordOtpVerification(
  otp: string,
  email: string
) {
  return companyAPI.post("/auth/password/otp/verify", { otp, email });
}

// reset password 812
export async function companyResetPasswordApi(
  email: string,
  newPassword: string
) {
  return companyAPI.post("/auth/password/reset", {
    email,
    password:newPassword,
  });
}

// logout
export async function companyLogoutApi() {
  return companyAPI.post("/auth/logout");
}


