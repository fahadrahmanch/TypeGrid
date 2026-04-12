import { companyAPI } from "../axios/companyAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export async function fetchCompanyUserProfile(userId: string) {
    return companyAPI.get(API_ROUTES.GET_COMPANY_USER_PROFILE(userId));
}

export async function updateProfilePicture(userId: string, formData: FormData) {
    return companyAPI.put(API_ROUTES.GET_COMPANY_USER_PROFILE(userId), formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export async function updateCompanyPassword(data: {currentPassword:string,newPassword:string},userId:string) {
    return companyAPI.put(API_ROUTES.UPDATE_COMPANY_PASSWORD(userId), data);
}