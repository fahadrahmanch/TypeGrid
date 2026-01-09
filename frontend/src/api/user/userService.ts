// import { userAPI } from "../axios/userAPI";

// export async function CompanyDetailsApi(data: any) {
//   return userAPI.post("/subscription/company/verify", data);
// }

// export async function reApplyCompanyDetails(data:any){
//   return userAPI.put("/subscription/company/re-verify",data);
// }

// export async function GetUserDataApi(){
//   return userAPI.get("/users/me");
// }
// export async function UpdateUserDataApi(user:any){
//   return userAPI.post("/users/me",user);
// }

// export async function getCompanyStatus(){
//   return userAPI.get("/subscription/company/status");
// }

// // typing practice content fetcher

import { userAPI } from "../axios/userAPI";


// get logged-in user data
export async function getUserDataApi() {
  return userAPI.get("/me");
}

// update logged-in user data
export async function updateUserDataApi(user: any) {
  return userAPI.put("/me", user);
}



// apply / verify company
export async function verifyCompanyApi(data: any) {
  return userAPI.post("/company/verification", data);
}

// re-apply company verification
export async function reVerifyCompanyApi(data: any) {
  return userAPI.put("/company/verification/retry", data);
}

// get company verification status
export async function getCompanyStatusApi() {
  return userAPI.get("/company/status");
}





