import { companyAPI } from "../axios/companyAPI";

// add user to company
export async function companyAddUser(data: any) {
  return companyAPI.post("/users", data);
}

// get all company users
export async function fetchCompanyUsers() {
  return companyAPI.get("/users");
}

// delete company user
export async function deleteCompanyUser(userId: string) {
  return companyAPI.delete(`/users/${userId}`);
}


