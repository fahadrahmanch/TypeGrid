export type CompanyGroupType = "beginner" | "intermidate" | "advanced";

export interface CompanyGroupProps {
  id?: string;
  companyId: string;
  name: string;
  type: CompanyGroupType;
  members?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class CompanyGroupEntity {
  private id?: string;
  private companyId: string;
  private name: string;
  private type: CompanyGroupType;
  private members: string[];
  private createdAt?: Date;
  private updatedAt?: Date;

  constructor(props: CompanyGroupProps) {
    this.id = props.id;
    this.companyId = props.companyId;
    this.name = props.name;
    this.type = props.type;
    this.members = props.members ?? [];
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  getId() {
    return this.id;
  }

  getCompanyId() {
    return this.companyId;
  }

  getName() {
    return this.name;
  }

  getType() {
    return this.type;
  }

  getMembers() {
    return this.members;
  }

  addMember(userId: string) {
    if (!this.members.includes(userId)) {
      this.members.push(userId);
    }
  }

  removeMember(userId: string) {
    this.members = this.members.filter(id => id !== userId);
  }
}
