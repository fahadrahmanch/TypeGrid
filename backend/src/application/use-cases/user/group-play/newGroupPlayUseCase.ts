import { INewGroupPlayUseCase } from "../../interfaces/user/groupplayUseCases/INewGroupPlayUseCase";
import { IGroupRepository } from "../../../../domain/interfaces/repository/user/IGroupRepository";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/customError";
import { HttpStatusCodes } from "../../../../domain/enums/httpStatusCodes";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/IUserRepository";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/ICompetitionRepository";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/ILessonRepository";
import { CompetitionEntity } from "../../../../domain/entities/CompetitionEntity";
import { GroupEntity } from "../../../../domain/entities/GroupEntity";

import { mapCompetitionToDTOGroupPlay } from "../../../DTOs/user/CompetitionDTOGroupPlay";
import { CompetitionDTOGroupPlay } from "../../../DTOs/user/CompetitionDTOGroupPlay";

export class newGroupPlayUseCase implements INewGroupPlayUseCase {
  constructor(
    private groupRepository: IGroupRepository,
    private userRepository: IUserRepository,
    private competitionRepository: ICompetitionRepository,
    private lessonRepository: ILessonRepository,
  ) {}

  async execute(
    gameId: string,
    users: string[],
  ): Promise<CompetitionDTOGroupPlay> {
    const compatitionData = await this.competitionRepository.findById(gameId);
    if ((compatitionData as any).status !== "completed") {
      throw new CustomError(
        HttpStatusCodes.BAD_REQUEST,
        "Cannot start a new game. The current game is not completed yet.",
      );
    }
    if (!compatitionData) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        "Competition not found with the provided game ID.",
      );
    }
    const competitionEntity = new CompetitionEntity({
      ...(compatitionData as any),
      id: (compatitionData as any)._id,
    });
    const groupId = competitionEntity.getGroupId();
    if (!groupId) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.GROUP_NOT_FOUND,
      );
    }
    const groupData = await this.groupRepository.findById(groupId);
    if (!groupData) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.GROUP_NOT_FOUND,
      );
    }
    const groupEntity = new GroupEntity(groupData as any);
    groupEntity.setGroupMembers(users);
    groupEntity.setStatus("started");
    const updatedGroup = groupEntity.toObject();
    await this.groupRepository.update(updatedGroup);
    const JoinLink = groupEntity.getJoinLink();
    const difficulty = groupEntity.getDifficulty();
    const level =
      difficulty === "easy"
        ? "beginner"
        : difficulty === "medium"
          ? "intermediate"
          : "advanced";
    const lessons = await this.lessonRepository.find({
      level: level,
      createdBy: "admin",
    });
    if (!lessons.length) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        "No lessons found for this level",
      );
    }
    let randomIndex = Math.floor(Math.random() * lessons.length);
    let selectedLesson = lessons[randomIndex];
    const newCompetitionEntity = new CompetitionEntity({
      type: "group",
      mode: "global",
      textId:
        (selectedLesson as any)._id?.toString() || (selectedLesson as any).id,
      participants: users,
      groupId: groupId,
      duration: 100,
      status: "ongoing",
      countDown: (compatitionData as any).countDown || 10,
    });
    const competitionObject = newCompetitionEntity.toObject();
    const newCompetition =
      await this.competitionRepository.create(newCompetitionEntity);
    const populatedParticipants = await Promise.all(
      (newCompetitionEntity as any).participants.map((item: any) =>
        this.userRepository.findById(item),
      ),
    );

    const responseCompetition = {
      ...(newCompetition as any),
      participants: populatedParticipants,
      lesson: selectedLesson,
      joinLink: JoinLink,
    };
    return mapCompetitionToDTOGroupPlay(
      responseCompetition,
      groupEntity.getOwnerId(),
    );
  }
}
