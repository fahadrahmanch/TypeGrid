export interface AddUserDTO {
  name: string;
  email: string;
  password: string;
  CompanyId: string;
  role?: "user" | "admin" | "companyUser" | "companyAdmin";
}
