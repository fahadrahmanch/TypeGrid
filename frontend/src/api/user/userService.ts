import API from "../axios/userAPI";
export async function CompanyDetailsApi(data: any) {
    console.log("here",data);
    return API.post("/subscription/company/verify", data);
}