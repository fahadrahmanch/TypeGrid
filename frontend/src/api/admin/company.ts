import { adminAPI } from "../axios/adminAPI";
import { API_ROUTES } from "../../constants/apiRoutes";

export async function companies(searchText: string, status: string, page: number, limit: number) {
  return adminAPI.get(API_ROUTES.ADMIN.COMPANIES.BASE, { params: { searchText, status, page, limit } });
}

export async function updateCompanyStatus(
  companyId: string,
  status: "active" | "reject",
  reason?: string,
) {
  return adminAPI.patch(API_ROUTES.ADMIN.COMPANIES.STATUS(companyId), {
    status,
    reason,
  });
}

