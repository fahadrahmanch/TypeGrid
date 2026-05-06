export interface CompanyUserManagementDTO {
  _id?: string;
  name: string;
  email: string;
  imageUrl?: string;
  bio?: string;
  age?: string;
  number?: string;
  CompanyId?: string;
  CompanyRole?: string;
  KeyBoardLayout?: string;
  status?: string;
  contactNumber?: number;
  gender?: string;
  role: string;
  wpm: number;
  accuracy: number;
  createdAt?: Date;
}
