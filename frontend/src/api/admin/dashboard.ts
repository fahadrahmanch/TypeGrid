import { adminAPI } from "../axios/adminAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export const getDashboardStats = async () => {
    return adminAPI.get(API_ROUTES.ADMIN.DASHBOARD_STATS);
};
