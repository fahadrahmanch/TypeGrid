import { userAPI } from "../axios/userAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

// get logged-in user data
export async function getUserDataApi() {
  return userAPI.get(API_ROUTES.USER.ME);
}

// update logged-in user data
export async function updateUserDataApi(user: any) {
  return userAPI.put(API_ROUTES.USER.ME, user);
}

// apply / verify company
export async function verifyCompanyApi(data: any) {
  return userAPI.post(API_ROUTES.USER.VERIFY_COMPANY, data);
}

// re-apply company verification
export async function reVerifyCompanyApi(data: any) {
  return userAPI.put(API_ROUTES.USER.RE_VERIFY_COMPANY, data);
}

// get company verification status
export async function getCompanyStatusApi() {
  return userAPI.get(API_ROUTES.USER.COMPANY_STATUS);
}

// change password
export async function changePasswordApi(data: any) {
  return userAPI.put(API_ROUTES.USER.CHANGE_PASSWORD, data);
}

export async function getCompanyDetailsApi() {
  return userAPI.get(API_ROUTES.USER.GET_COMPANY_DETAILS);
}

export async function getAnotherUserProfileApi(userId: string) {
  return userAPI.get(API_ROUTES.GET_COMPANY_USER_PROFILE(userId));
}
