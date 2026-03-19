import { ICompanyGroupDocument } from "../types/documents";
import { CompanyGroupEntity } from "../../../domain/entities/company-group.entity";

export class CompanyGroupMapper {
  static toDomain(doc: ICompanyGroupDocument): CompanyGroupEntity {
    return new CompanyGroupEntity({
      id: doc?._id?.toString(),
      companyId: doc?.companyId?.toString(),
      name: doc?.name,
      type: doc?.type,
      members: doc?.members?.map((m) => m.toString()),
      createdAt: doc?.createdAt,
      updatedAt: doc?.updatedAt,
    });
  }
}
