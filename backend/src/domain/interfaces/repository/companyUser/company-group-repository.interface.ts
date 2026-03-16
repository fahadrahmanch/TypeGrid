import { ICompanyGroupDocument } from "../../../../infrastructure/db/types/documents";

export interface ICompanyGroupRepository<ICompanyGroupDocument> {
  getGroup(userId: string): Promise<T[] | null>;
}
