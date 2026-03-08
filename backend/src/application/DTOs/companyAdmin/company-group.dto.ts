export interface CompanyGroupDTO {
  groupName: string;
  groupType: "beginner" | "intermidate" | "advanced";
  selectedUsers: string[];
}
