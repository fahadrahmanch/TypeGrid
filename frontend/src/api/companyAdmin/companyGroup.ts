import { companyAPI } from "../axios/companyAPI";

export const createCompanyGroup = async (groupData: any) => {
    return companyAPI.post("/company-groups", groupData);
}
export const getCompanyGroups = async () => {
    return await companyAPI.get("/company-groups");
}