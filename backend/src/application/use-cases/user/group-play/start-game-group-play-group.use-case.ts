import { IStartGameGroupPlayGroupUseCase } from "../../interfaces/user/group-play/start-game-group-play-group.interface";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/competition-repository.interface";
import { IGroupRepository } from "../../../../domain/interfaces/repository/user/group-repository.interface";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { CompetitionEntity } from "../../../../domain/entities/competition.entity";
import { mapLessonDTOforGroupPlay } from "../../../DTOs/admin/lesson-management.dto";
import { mapCompetitionToDTOGroupPlay } from "../../../DTOs/user/competition-group-play.dto";
import { CompetitionDTOGroupPlay } from "../../../DTOs/user/competition-group-play.dto";
import { groupDTO, mapGroupToDTO } from "../../../DTOs/user/group.dto";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
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
