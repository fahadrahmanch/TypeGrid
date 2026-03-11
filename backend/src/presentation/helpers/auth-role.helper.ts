
export function getRoleConfig(base: string): { 
  tokenName: string; 
  role: string; 
  path: string 
} {
  if (base.startsWith("/admin")) return { tokenName: "refresh_admin", role: "admin", path: "/admin" };
  if (base.startsWith("/company")) return { tokenName: "refresh_company", role: "company", path: "/company" };
  return { tokenName: "refresh_user", role: "user", path: "/user" };
}