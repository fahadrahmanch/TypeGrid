import { userAPI } from "../axios/userAPI";
import { API_ROUTES } from "../../constants/apiRoutes";
export async function getSubscriptionPlans() {
    return userAPI.get(API_ROUTES.USER.SUBSCRIPTION);
}
export async function getCompanyPlans() {
    return userAPI.get(API_ROUTES.USER.COMPANY_PLANS);
}
export async function createSubscriptionSession(planId: string) {
    return userAPI.post(API_ROUTES.USER.CREATE_SUBSCRIPTION_SESSION, { planId });
}
export async function createCompanySubscriptionSession(planId: string) {
    return userAPI.post(API_ROUTES.USER.CREATE_COMPANY_SUBSCRIPTION_SESSION, { planId });
}
export async function confirmSubscription(planId: string) {
    return userAPI.post(API_ROUTES.USER.CONFIRM_SUBSCRIPTION, { planId });
}
export async function confirmCompanySubscription(planId: string) {
    return userAPI.post(API_ROUTES.USER.CONFIRM_COMPANY_SUBSCRIPTION, { planId });
}

export async function cancelSubscription(planId: string) {
    return userAPI.post(API_ROUTES.USER.CANCEL_SUBSCRIPTION, { planId });
}

export async function cancelCompanySubscription(planId: string) {
    return userAPI.post(API_ROUTES.USER.CANCEL_COMPANY_SUBSCRIPTION, { planId });
}
export async function getSubscriptionDetails() {
    return userAPI.get(API_ROUTES.USER.SUBSCRIPTION_DETAILS);
}