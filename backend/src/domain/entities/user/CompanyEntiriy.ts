import { Entity } from "../entity";
export class companyEntity extends Entity<companyEntity>{
      constructor(attrs?: Partial<companyEntity>) {
    super(attrs);
  }
    _id?:string;
    companyName?:string;
    email?:string;
    address?:string;
    number?:string;
    OwnerId?:string;
    // subscriptionPlansId!: string;
    rejectionReason?:string;
    status?: "active" | "inactive"|"pending"|"reject";
}
