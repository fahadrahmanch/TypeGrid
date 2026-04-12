export interface CreateCompanyGroupAutoDTO {
  groupName: string;
  groupType: "beginner" | "intermidate" | "advanced";
  minWpm: string;
  maxWpm: string;
  minAccuracy: string;
  maxAccuracy: string;
}

