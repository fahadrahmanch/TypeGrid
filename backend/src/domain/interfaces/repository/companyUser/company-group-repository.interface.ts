import { ICompanyGroupDocument } from "../../../../infrastructure/db/types/documents";

export interface ICompanyGroupRepository {
  getGroup(userId: string): Promise<ICompanyGroupDocument[] | null>;
}
