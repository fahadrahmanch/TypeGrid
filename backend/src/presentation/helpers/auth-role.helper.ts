export function getRoleConfig(base: string): {
  tokenName: string;
  role: string;
  path: string;
} {
  if (base.startsWith("/admin")) return { tokenName: "refresh_token", role: "admin", path: "/admin" };
  if (base.startsWith("/company")) return { tokenName: "refresh_token", role: "company", path: "/company" };
  return { tokenName: "refresh_token", role: "user", path: "/user" };
}
