import { companyAPI } from "../axios/companyAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export async function getCompanyDetailsApi() {
    return companyAPI.get(API_ROUTES.GET_COMPANY_DETAILS);
}