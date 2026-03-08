import { INewGroupPlayUseCase } from "../../interfaces/user/group-play/new-group-play.interface";
import { IGroupRepository } from "../../../../domain/interfaces/repository/user/group-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/competition-repository.interface";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { CompetitionEntity } from "../../../../domain/entities/competition.entity";
import { GroupEntity } from "../../../../domain/entities/group.entity";

import { mapCompetitionToDTOGroupPlay } from "../../../DTOs/user/competition-group-play.dto";
import { CompetitionDTOGroupPlay } from "../../../DTOs/user/competition-group-play.dto";

export class NewGroupPlayUseCase implements INewGroupPlayUseCase {
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
