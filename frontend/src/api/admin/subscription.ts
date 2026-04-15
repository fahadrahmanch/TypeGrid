import { adminAPI } from "../axios/adminAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export async function createSubscriptionPlan(data: any) {
    return adminAPI.post(API_ROUTES.ADMIN.SUBSCRIPTION.BASE, data);
}

export async function updateSubscriptionPlan(id: string, data: any) {
    return adminAPI.put(API_ROUTES.ADMIN.SUBSCRIPTION.BY_ID(id), data);
}