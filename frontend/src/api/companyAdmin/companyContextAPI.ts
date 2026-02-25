import { companyAPI } from "../axios/companyAPI";

export const createCompanyContest = (data: any) => {
    return companyAPI.post("/company/contest", data);
};

export const fetchContestDetails = (contestId: string) => {
    return companyAPI.get(`/company/contest/${contestId}`);
};
export const fetchContestAreaDetails = (contestId: string) => {
    return companyAPI.get(`/company/contest-area/${contestId}`);
};
export const companyContests=()=>{
    return companyAPI.get("/company/contests");
};
export const updateContestStatus = (contestId: string, status: string) => {
    return companyAPI.patch(`/company/contest/${contestId}/status`, { status });
};