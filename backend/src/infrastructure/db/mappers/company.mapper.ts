import { ICompanyDocument } from "../types/documents";
import { CompanyEntity } from "../../../domain/entities";

export class CompanyMapper {
  static toDomain(doc: ICompanyDocument): CompanyEntity {
    
    return new CompanyEntity({
      ...doc,
      _id: doc?._id?.toString(),
      OwnerId: doc?.OwnerId?.toString(),
    });
  }
}