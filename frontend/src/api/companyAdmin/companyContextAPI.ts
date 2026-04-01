import { companyAPI } from "../axios/companyAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export const createCompanyContest = (data: any) => {
  return companyAPI.post(API_ROUTES.ADMIN.COMPANY_CONTESTS.BASE, data);
};

export const updateCompanyContest = (contestId: string, data: any) => {
  return companyAPI.put(API_ROUTES.ADMIN.COMPANY_CONTESTS.BY_ID(contestId), data);
};

export const fetchContestDetails = (contestId: string) => {
  return companyAPI.get(API_ROUTES.ADMIN.COMPANY_CONTESTS.BY_ID(contestId));
};

export const fetchContest = (contestId: string) => {
  return companyAPI.get(API_ROUTES.ADMIN.COMPANY_CONTESTS.ADMIN(contestId));
};

export const fetchContestAreaDetails = (contestId: string) => {
  return companyAPI.get(API_ROUTES.ADMIN.COMPANY_CONTESTS.AREA(contestId));
};

export const companyContests = () => {
  return companyAPI.get(API_ROUTES.ADMIN.COMPANY_CONTESTS.LIST);
};

export const updateContestStatus = (contestId: string, status: string) => {
  return companyAPI.patch(API_ROUTES.ADMIN.COMPANY_CONTESTS.STATUS(contestId), { status });
};

export const fetchContestParticipants = (contestId: string) => {
  return companyAPI.get(API_ROUTES.ADMIN.COMPANY_CONTESTS.PARTICIPANTS(contestId));
};

export const deleteContest = (contestId: string) => {
  return companyAPI.delete(API_ROUTES.ADMIN.COMPANY_CONTESTS.BY_ID(contestId));
};

export const fetchContestResults = (contestId: string) => {
  return companyAPI.get(API_ROUTES.ADMIN.COMPANY_CONTESTS.RESULTS(contestId));
};