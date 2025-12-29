import { adminAPI } from "../axios/adminAPI";
export async function getAllcompanies() {
  return adminAPI.get("/company");
}
export async function approveCompanyRequest(_id:string){
    return adminAPI.patch("/approve/company",{_id});
}
export async function rejectCompanyRequest(_id:string,reason:string){
    return adminAPI.patch("/reject/company",{_id,reason});
}
