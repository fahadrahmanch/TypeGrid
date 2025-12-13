import { adminAPI } from "../axios/adminAPI";
export async function getAllcompanies() {
  return adminAPI.get("/company");
}
export async function approveCompanyRequest(_id:string){
    return adminAPI.post("/approve/company",{_id});
}
export async function rejectCompanyRequest(_id:string){
    return adminAPI.post("/reject/company",{_id});
}
