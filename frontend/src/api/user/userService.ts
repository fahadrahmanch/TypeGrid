import { userAPI } from "../axios/userAPI";
export async function CompanyDetailsApi(data: any) {
  return userAPI.post("/subscription/company/verify", data);
}
export as
