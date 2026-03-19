import { companyAPI } from "../axios/companyAPI";

export const createCompanyContest = (data: any) => {
  return companyAPI.post("/company/contest", data);
};
export const updateCompanyContest = (contestId: string, data: any) => {
  return companyAPI.put(`/company/contest/${contestId}`, data);
};

export const fetchContestDetails = (contestId: string) => {
  return companyAPI.get(`/company/contest/${contestId}`);
};
export const fetchContest = (contestId: string) => {
  return companyAPI.get(`/company/contest/${contestId}/admin`);
};
export const fetchContestAreaDetails = (contestId: string) => {
  return companyAPI.get(`/company/contest-area/${contestId}`);
};
export const companyContests = () => {
  return companyAPI.get("/company/contests");
};
export const updateContestStatus = (contestId: string, status: string) => {
  return companyAPI.patch(`/company/contest/${contestId}/status`, { status });
};
export const fetchContestParticipants = (contestId: string) => {
  return companyAPI.get(`/company/contest/${contestId}/participants`);
};
export const deleteContest = (contestId: string) => {
  return companyAPI.delete(`/company/contest/${contestId}`);
};
export const fetchContestResults = (contestId: string) => {
  return companyAPI.get(`/company/contest/${contestId}/results`);
}