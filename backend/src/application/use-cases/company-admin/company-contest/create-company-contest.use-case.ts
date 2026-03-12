import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { ICompanyGroupRepository } from "../../../../domain/interfaces/repository/company/company-group-repository.interface";
import { IContestRepository } from "../../../../domain/interfaces/repository/company/contest-repository.interface";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { ICreateCompanyContestUseCase } from "../../interfaces/companyAdmin/create-company-contest.interface";
import { CreateContestDTO } from "../../../DTOs/companyAdmin/company-contest.dto";
import { ContestEntity } from "../../../../domain/entities/company-contest.entity";
import { mapContestDTOAdmin } from "../../../mappers/companyAdmin/company-contest.mapper";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";

/**
 * Use case for creating a company contest.
 * Handles the business logic for creating a new contest within a company context.
 * Validates user permissions, company assignment, and required contest data.
 * Supports both random text selection from lessons and group-based contest modes.
 */
export class CreateCompanyContestUseCase implements ICreateCompanyContestUseCase {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _companyGroupRepository: ICompanyGroupRepository,
    private readonly _contestRepository: IContestRepository,
    private readonly _lessonRepository: ILessonRepository,
  ) {}

  async execute(data: CreateContestDTO, userId: string): Promise<CreateContestDTO> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }

    if (!user.CompanyId) {
      throw new CustomError(HttpStatusCodes.FORBIDDEN, MESSAGES.USER_NO_COMPANY_ASSIGNED);
    }

    if (!data.date || !data.startTime) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, MESSAGES.DATE_OR_START_TIME_REQUIRED);
    }

    if (data.textSource === "random") {
      const difficulty = this.mapDifficulty(data.difficulty);
      const lesson = await this._lessonRepository.findOne({ level: difficulty });

      if (!lesson) {
        throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.LESSON_NOT_FOUND);
      }

      data.contestText = lesson.text;
    }

    if (data.contestMode === "group") {
      if (!data.targetGroup) {
        throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.GROUP_NOT_FOUND);
      }

      const group = await this._companyGroupRepository.findById(data.targetGroup);

      if (!group) {
        throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.GROUP_NOT_FOUND);
      }
    }

    const contest = new ContestEntity({
      ...data,
      date: new Date(data.date),
      startTime: new Date(`${data.date}T${data.startTime}:00`),
      duration: Number(data.duration) * 60,
      maxParticipants: Number(data.maxParticipants),
      groupId: data.targetGroup ?? null,
      rewards: data.rewards.map((r) => ({ rank: r.rank, prize: Number(r.prize) })),
      CompanyId: user.CompanyId,
      countDown: 10,
    });

    const newContest = await this._contestRepository.create(contest);

    return mapContestDTOAdmin(newContest);
  }

  private mapDifficulty(difficulty: string): string {
    const map: Record<string, string> = {
      easy: "beginner",
      medium: "intermediate",
      hard: "advanced",
    };
    return map[difficulty] ?? "beginner";
  }
}