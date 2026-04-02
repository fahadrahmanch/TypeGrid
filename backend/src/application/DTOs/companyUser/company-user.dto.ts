export interface companyUserDTO {
  _id: string;
  name: string;
  email: string;
  imageUrl: string;
  number?: string;
  bio?: string;
  companyRole?: string;
  online: boolean;
}
