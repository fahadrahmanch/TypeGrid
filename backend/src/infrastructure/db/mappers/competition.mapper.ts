import { ICompetitionDocument } from "../types/documents";
import { CompetitionEntity } from "../../../domain/entities/competition.entity";

export class CompetitionMapper {
  static toDomain(doc: ICompetitionDocument): CompetitionEntity {
    return new CompetitionEntity({
      id: doc._id?.toString(),
      type: doc.type,
      mode: doc.mode,
      participants: doc.participants?.map((p) => p.toString()) ?? [],
      groupId: doc.groupId?.toString() ?? null,
      status: doc.status,
      textId: doc.textId?.toString(),
      duration: doc.duration,
      countDown: doc.countDown,
      CompanyId: doc.CompanyId?.toString(),
      reward:
        doc.reward?.map((r) => ({
          rank: r.rank ?? 0,
          prize: String(r.prize ?? 0),
        })) ?? [],
      startedAt: doc.startedAt ?? undefined,
    });
  }
}
