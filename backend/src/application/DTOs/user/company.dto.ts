export interface CompanyDTO {
  _id?: string;
  companyName?: string;
  email?: string;
  address?: string;
  number?: string;
  OwnerId?: string;
  planId?: string;
  status?: 'active' | 'inactive' | 'pending' | 'reject' | 'expired';
  startDate?: Date;
  endDate?: Date;
}
