import { companyAPI } from "../axios/companyAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export const createCompanyGroup = async (groupData: any) => {
  return companyAPI.post(API_ROUTES.ADMIN.COMPANY_GROUPS, groupData);
};

export const createCompanyGroupAuto = async (groupData: any) => {
  return companyAPI.post(API_ROUTES.ADMIN.COMPANY_GROUPS_AUTO, groupData);
};

export const getCompanyGroups = async () => {
  return await companyAPI.get(API_ROUTES.ADMIN.COMPANY_GROUPS);
};

export const getCompanyGroupById = async (id: string) => {
  return await companyAPI.get(API_ROUTES.ADMIN.COMPANY_GROUP_BY_ID(id));
};

export const removeMemberFromGroup = async (groupId: string, memberId: string) => {
  return await companyAPI.patch(API_ROUTES.ADMIN.REMOVE_MEMBER_FROM_GROUP(groupId, memberId));
};

export const addMemberToGroup = async (groupId: string, memberId: string) => {
  return await companyAPI.patch(API_ROUTES.ADMIN.ADD_MEMBER_TO_GROUP(groupId, memberId));
};

export const deleteCompanyGroup = async (groupId: string) => {
  return await companyAPI.delete(API_ROUTES.ADMIN.COMPANY_GROUP_BY_ID(groupId));
};

export const getCompanyUsersWithStatus = async () => {
  return await companyAPI.get(API_ROUTES.COMPANY_USERS_WITH_STATUS);
};
