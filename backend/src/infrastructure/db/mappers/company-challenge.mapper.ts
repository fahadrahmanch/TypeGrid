import { ICompanyChallengeDocument } from "../types/documents";
import { CompanyChallengeEntity } from "../../../domain/entities/company-challenge.entity";

export class CompanyChallengeMapper {
  static toDomain(doc: ICompanyChallengeDocument): CompanyChallengeEntity {
    return new CompanyChallengeEntity({
      _id: doc?._id?.toString(),
      CompanyId: doc?.CompanyId?.toString(),
      senderId: doc?.senderId?.toString(),
      receiverId: doc?.receiverId?.toString(),
      status: doc?.status,
      competitionId: doc?.competitionId?.toString(),
    });
  }
}
