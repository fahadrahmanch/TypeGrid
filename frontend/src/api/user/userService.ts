import { userAPI } from "../axios/userAPI";

export async function CompanyDetailsApi(data: any) {
  return userAPI.post("/subscription/company/verify", data);
}

export async function GetUserDataApi(){
  return userAPI.get("/data");
}
export async function UpdateUserDataApi(user:any){
  return userAPI.post("/update",user);
}

export async function getCompanyStatus(){
  return userAPI.get("/subscription/company/status");
}