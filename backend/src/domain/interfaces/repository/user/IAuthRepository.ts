import { IBaseRepository } from "../IBaseRepository";
import { IUserDocument } from "../../../../infrastructure/db/types/documents";

export interface IAuthRepostory extends IBaseRepository<IUserDocument> {
  findByEmail(email: string): Promise<IUserDocument | null>;
}
