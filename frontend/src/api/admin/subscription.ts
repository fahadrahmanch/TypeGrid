import { adminAPI } from "../axios/adminAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export async function getSubscriptionPlans() {
    return adminAPI.get(API_ROUTES.ADMIN.SUBSCRIPTION.BASE);
}

export async function createSubscriptionPlan(data: any) {
    return adminAPI.post(API_ROUTES.ADMIN.SUBSCRIPTION.BASE, data);
}

export async function updateSubscriptionPlan(id: string, data: any) {
    return adminAPI.put(API_ROUTES.ADMIN.SUBSCRIPTION.UPDATE_SUBSCRIPTION_PLAN(id), data);
}

export async function deleteSubscriptionPlan(id: string) {
    return adminAPI.delete(API_ROUTES.ADMIN.SUBSCRIPTION.DELETE_SUBSCRIPTION_PLAN(id));
}

export async function getSubscriptionPlanById(id: string) {
    return adminAPI.get(API_ROUTES.ADMIN.SUBSCRIPTION.BY_ID(id));
}

export async function getSubscriptionNormalPlans() {
    return adminAPI.get(API_ROUTES.ADMIN.SUBSCRIPTION.NORMAL);
}

export async function getSubscriptionCompanyPlans() {
    return adminAPI.get(API_ROUTES.ADMIN.SUBSCRIPTION.COMPANY);
}

