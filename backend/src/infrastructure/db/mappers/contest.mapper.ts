import { IContestDocument } from "../types/documents";
import { ContestEntity } from "../../../domain/entities/company-contest.entity";

export class ContestMapper {
  static toDomain(doc: IContestDocument): ContestEntity {
    return new ContestEntity({
      _id: doc?._id?.toString(),
      contestMode: doc?.contestMode,
      title: doc?.title,
      description: doc?.description,
      difficulty: doc?.difficulty,
      groupId: doc?.groupId?.toString() ?? undefined,
      textSource: doc?.textSource,
      participants: doc?.participants?.map((p) => p.toString()),
      contestText: doc?.contestText,
      date: doc?.date,
      startTime: doc?.startTime ?? doc?.startedAt ?? undefined,
      duration: doc?.duration,
      maxParticipants: doc?.maxParticipants,
      rewards: doc?.rewards,
      status: doc?.status,
      countDown: doc?.countDown || 10,
      CompanyId: doc?.CompanyId?.toString() ?? "",
      createdAt: doc?.createdAt,
      updatedAt: doc?.updatedAt,
    });
  }
}
