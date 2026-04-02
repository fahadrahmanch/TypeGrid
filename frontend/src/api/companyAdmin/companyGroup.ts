import { companyAPI } from "../axios/companyAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export const createCompanyGroup = async (groupData: any) => {
  return companyAPI.post(API_ROUTES.ADMIN.COMPANY_GROUPS, groupData);
};

export const getCompanyGroups = async () => {
  return await companyAPI.get(API_ROUTES.ADMIN.COMPANY_GROUPS);
};
