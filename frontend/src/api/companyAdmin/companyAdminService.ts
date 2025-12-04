import { companyAPI } from "../axios/companyAPI";

export async function companyAddUser(data: any) {
  return companyAPI.post("/company-admin/add/user", data);
}
export async function fetchCompanyUsers(){
  return companyAPI.get('/company-admin/users')
}