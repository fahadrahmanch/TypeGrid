import { IStartGameGroupPlayGroupUseCase } from "../../interfaces/user/groupplayUseCases/IStartGameGroupPlayGroupUseCase";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/ICompetitionRepository";
import { IGroupRepository } from "../../../../domain/interfaces/repository/user/IGroupRepository";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/ILessonRepository";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/IUserRepository";
import { CompetitionEntity } from "../../../../domain/entities/CompetitionEntity";
import { mapLessonDTOforGroupPlay } from "../../../DTOs/admin/lessonManagement.dto";
import { mapCompetitionToDTOGroupPlay } from "../../../DTOs/user/CompetitionDTOGroupPlay";
import { CompetitionDTOGroupPlay } from "../../../DTOs/user/CompetitionDTOGroupPlay";
import { groupDTO, mapGroupToDTO } from "../../../DTOs/user/groupDto";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/customError";
import { HttpStatusCodes } from "../../../../domain/enums/httpStatusCodes";
export class StartGameGroupPlayGroupUseCase implements IStartGameGroupPlayGroupUseCase {
  constructor(
    private _baseRepoCompetion: ICompetitionRepository,
    private groupRepository: IGroupRepository,
    private lessonRepository: ILessonRepository,
    private userRepository: IUserRepository,
  ) {}
  async execute(
    groupId: string,
    countDown: number,
  ): Promise<CompetitionDTOGroupPlay> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.GROUP_NOT_FOUND,
      );
    }
    const participants = group.members.map((item: any) => item.toString());
    const difficultyToLevelMap: Record<string, string> = {
      easy: "beginner",
      medium: "intermediate",
      hard: "advanced",
    };
    const level = difficultyToLevelMap[(group as any).difficulty];

    const lessons = await this.lessonRepository.find({
      level,
      createdBy: "admin",
    });
    if (!lessons.length) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.LESSON_NOT_FOUND,
      );
    }

    let randomIndex = Math.floor(Math.random() * lessons.length);
    let selectedLesson = mapLessonDTOforGroupPlay(lessons[randomIndex]);
    const competitionEntity = new CompetitionEntity({
      type: "group",
      mode: "global",
      textId: selectedLesson.id,
      participants,
      groupId: (group as any)._id.toString(),
      duration: 300,
      status: "ongoing",
      countDown,
    });
    const competitionObject = competitionEntity.toObject();
    const competition = await this._baseRepoCompetion.create(competitionEntity);
    const populatedParticipants = await Promise.all(
      (competitionEntity as any).participants.map((item: any) =>
        this.userRepository.findById(item),
      ),
    );
    const responseCompetition = {
      ...(competition as any),
      participants: populatedParticipants,
      lesson: selectedLesson,
      JoinLink: (group as any).joinLink,
    };

    return mapCompetitionToDTOGroupPlay(responseCompetition, group.ownerId);
  }
}
