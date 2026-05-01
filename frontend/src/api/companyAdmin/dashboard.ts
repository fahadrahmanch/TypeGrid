import { companyAPI } from "../axios/companyAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export const getCompanyDashboardStats = async () => {
    return companyAPI.get(API_ROUTES.COMPANY_ADMIN_DASHBOARD_STATS);
};
