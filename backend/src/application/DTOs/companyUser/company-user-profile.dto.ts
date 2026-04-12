export interface CompanyUserProfileDTO {
  identity: {
    fullName: string;
    email: string;
    role: string;
    company: string;
    memberSince: string;
    imageUrl: string;
  };
  stats: {
    avgSpeed: number;
    accuracy: number;
    lessons: number;
  };
  tier: string;
}
