import { companyAPI } from "../axios/companyAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

// add user to company
export async function companyAddUser(data: any) {
  return companyAPI.post(API_ROUTES.ADMIN.USERS.COMPANY_USERS, data);
}

// get all company users
export async function fetchCompanyUsers() {
  return companyAPI.get(API_ROUTES.ADMIN.USERS.COMPANY_USERS);
}

// delete company user
export async function deleteCompanyUser(userId: string) {
  return companyAPI.delete(API_ROUTES.ADMIN.USERS.BY_ID(userId));
}


