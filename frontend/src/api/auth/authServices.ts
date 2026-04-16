import { userAPI } from "../axios/userAPI";
import { SignupData } from "../../types/auth";
import { adminAPI } from "../axios/adminAPI";
import { companyAPI } from "../axios/companyAPI";
import { signInData } from "../../types/auth";
import { API_ROUTES } from "../../constants/apiRoutes";

//user

// signup
export async function signup(data: SignupData) {
  return userAPI.post(API_ROUTES.AUTH.SIGNUP, data);
}
// verify OTP (after signup)
export async function verifyOtp(otp: string, name: string, email: string, password: string) {
  return userAPI.post(API_ROUTES.AUTH.OTP_VERIFY, {
    otp,
    name,
    email,
    password,
  });
}

// resend OTP
export async function resendOtp(name: string, email: string) {
  return userAPI.post(API_ROUTES.AUTH.OTP_RESEND, { name, email });
}

// signin
export async function signIn(data: signInData) {
  return userAPI.post(API_ROUTES.AUTH.SIGNIN, { data });
}

// refresh token
export async function userRefreshAPI() {
  return userAPI.post(API_ROUTES.AUTH.REFRESH_TOKEN);
}

// google auth
export async function googleAuthApi(data: any) {
  return userAPI.post(API_ROUTES.AUTH.GOOGLE, data);
}

// logout
export async function logoutApi() {
  return userAPI.post(API_ROUTES.AUTH.LOGOUT);
}

// forgot password (send OTP)
export async function forgotPasswordApi(email: string) {
  return userAPI.post(API_ROUTES.AUTH.PASSWORD_FORGOT, { email });
}

// verify forgot-password OTP
export async function forgotPasswordOtpVerification(otp: string, email: string) {
  return userAPI.post(API_ROUTES.AUTH.PASSWORD_OTP_VERIFY, { otp, email });
}

// reset password
export async function resetPasswordApi(email: string, newPassword: string) {
  return userAPI.post(API_ROUTES.AUTH.PASSWORD_RESET, {
    email,
    password: newPassword,
  });
}

//admin

export async function adminSigninApi(data: signInData) {
  return adminAPI.post(API_ROUTES.AUTH.SIGNIN, { data });
}

// admin refresh token
export async function adminRefreshAPI() {
  return adminAPI.post(API_ROUTES.AUTH.REFRESH_TOKEN);
}

// admin logout
export async function adminLogoutApi() {
  return adminAPI.post(API_ROUTES.AUTH.LOGOUT);
}

// company signin
export async function companySignIn(data: any) {
  return companyAPI.post(API_ROUTES.AUTH.SIGNIN, { data });
}

// company refresh token
export async function companyRefreshAPI() {
  return companyAPI.post(API_ROUTES.AUTH.REFRESH_TOKEN);
}

// forgot password (send OTP)
export async function companyForgotPasswordApi(email: string) {
  return companyAPI.post(API_ROUTES.AUTH.PASSWORD_FORGOT, { email });
}

// verify forgot-password OTP
export async function companyForgotPasswordOtpVerification(otp: string, email: string) {
  return companyAPI.post(API_ROUTES.AUTH.PASSWORD_OTP_VERIFY, { otp, email });
}

// reset password 812
export async function companyResetPasswordApi(email: string, newPassword: string) {
  return companyAPI.post(API_ROUTES.AUTH.PASSWORD_RESET, {
    email,
    password: newPassword,
  });
}

// logout
export async function companyLogoutApi() {
  return companyAPI.post(API_ROUTES.AUTH.LOGOUT);
}
