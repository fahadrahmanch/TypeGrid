import { Entity } from "./entity";
export class CompanyEntity extends Entity<CompanyEntity> {
  constructor(attrs?: Partial<CompanyEntity>) {
    super(attrs);
  }
  _id?: string;
  companyName?: string;
  email?: string;
  address?: string;
  number?: string;
  OwnerId?: string;
  // subscriptionPlansId!: string;
  rejectionReason?: string;
  status?: "active" | "inactive" | "pending" | "reject";
}
