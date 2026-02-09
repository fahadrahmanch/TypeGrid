import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { IStartQuickPlayUseCase } from "../../interfaces/user/quickPlayUseCases/IStartQuickPlayUseCase";
import { CompetitionEntity } from "../../../../domain/entities/CompetitionEntity";
import { mapCompetitionToDTOQuickPlay } from "../../../DTOs/user/CompetitionDTOQuickPlay";
import { CompetitionDTOQuickPlay } from "../../../DTOs/user/CompetitionDTOQuickPlay";
export class startQuickPlayUseCase implements IStartQuickPlayUseCase {
  constructor(
    private _baseRepoCompetition: IBaseRepository<any>,
    private _baseRepoUser: IBaseRepository<any>,
    private _baseRepoLesson: IBaseRepository<any>,
  ) {}
  async execute(userId: string): Promise<CompetitionDTOQuickPlay> {
    if (!userId) {
      throw new Error("User ID is required to start quick play.");
    }
    const user = await this._baseRepoUser.findById(userId);
    if (!user) {
      throw new Error("User not found with the provided ID.");
    }

  const competition = await this._baseRepoCompetition.findOne({
  status: "pending",
  $expr: { $lt: [{ $size: "$participants" }, 5] },
  participants: { $ne: userId },
});

   
     if (competition) {
    const competitionEntity = new CompetitionEntity({
      id: competition._id,
      ...competition,
      participants: competition.participants.map((p: any) => p.toString()),
    });

    competitionEntity.addParticipant(userId.toString());

    await this._baseRepoCompetition.update(
      { _id: competition._id ,
       participants: competitionEntity.getParticipants() }
    );

    const populatedParticipants = await Promise.all(
      competitionEntity
        .getParticipants()
        .map((id: string) => this._baseRepoUser.findById(id))
    );

    const lesson = await this._baseRepoLesson.findById(
      competition.textId
    );

    return mapCompetitionToDTOQuickPlay({
      ...competition,
      participants: populatedParticipants,
      lesson,
    });
  }
  const levels = ["beginner", "intermediate", "advanced"];
  const selectedLevel = levels[Math.floor(Math.random() * levels.length)];

  const lessons = await this._baseRepoLesson.find({
    level: selectedLevel,
    createdBy: "admin",
  });

  const selectedLesson =
    lessons[Math.floor(Math.random() * lessons.length)];

  const competitionEntity = new CompetitionEntity({
    type: "quick",
    mode: "global",
    duration: 50,
    startTime: 10,
    status: "pending",
    participants: [userId.toString()],
    textId: selectedLesson._id.toString(),
  });

  const createdCompetition = await this._baseRepoCompetition.create(
    await competitionEntity.toObject()
  );

  const populatedParticipants = [
    await this._baseRepoUser.findById(userId),
  ];

  return mapCompetitionToDTOQuickPlay({
    ...createdCompetition,
    participants: populatedParticipants,
    lesson: selectedLesson,
  });
}
  }

