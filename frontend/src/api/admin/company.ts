import { adminAPI } from "../axios/adminAPI";
export async function getAllcompanies() {
  return adminAPI.get("/companies");
}
export async function updateCompanyStatus(
  companyId: string,
  status: "active" | "reject",
  reason?: string
) {
  return adminAPI.patch(`/companies/${companyId}/status`, {
    status,
    reason,
  });
}

