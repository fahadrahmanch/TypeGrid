export interface CompanyGroupMemberDTO {
  _id: string;
  name: string;
  email: string;
  imageUrl?: string;
  CompanyId?: string;
  wpm: number;
  accuracy: number;
}

export interface CompanyGroupDetailsDTO {
  id: string;
  companyId: string;
  name: string;
  type: string;
  members: CompanyGroupMemberDTO[];
}
