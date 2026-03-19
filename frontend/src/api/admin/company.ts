import { adminAPI } from "../axios/adminAPI";
export async function companies(searchText: string, status: string, page: number, limit: number) {
  return adminAPI.get("/companies", { params: { searchText, status, page, limit } });
}
export async function updateCompanyStatus(
  companyId: string,
  status: "active" | "reject",
  reason?: string,
) {
  return adminAPI.patch(`/companies/${companyId}/status`, {
    status,
    reason,
  });
}
