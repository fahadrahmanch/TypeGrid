import { companyAPI } from "../axios/companyAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export const getCompanyUserDashboardStats = async () => {
    return companyAPI.get(API_ROUTES.COMPANY_USER_DASHBOARD_STATS);
};
