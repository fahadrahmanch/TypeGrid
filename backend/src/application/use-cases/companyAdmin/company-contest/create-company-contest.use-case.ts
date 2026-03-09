import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { ICompanyGroupRepository } from "../../../../domain/interfaces/repository/company/company-group-repository.interface";
import { IContestRepository } from "../../../../domain/interfaces/repository/company/contest-repository.interface";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { ICreateCompanyContestUseCase } from "../../interfaces/companyAdmin/create-company-contest.interface";
import { CreateContestDTO } from "../../../DTOs/companyAdmin/company-contest.dto";
import { ContestEntity } from "../../../../domain/entities/company-contest.entity";
import { mapContestDTOAdmin } from "../../../mappers/companyAdmin/company-contest.mapper";
import { MESSAGES } from "../../../../domain/constants/messages";
export class CreateCompanyContestUseCase implements ICreateCompanyContestUseCase {
  constructor(
    private userRepository: IUserRepository,
    private _baseRepoCompanyGroup: ICompanyGroupRepository,
    private contestRepository: IContestRepository,
    private lessonRepository: ILessonRepository,
  ) {}

  async execute(
    data: CreateContestDTO,
    userId: string,
  ): Promise<CreateContestDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error(MESSAGES.AUTH_USER_NOT_FOUND);
    }
    const companyId = user.CompanyId;
    if (!companyId) {
      throw new Error(MESSAGES.USER_NO_COMPANY_ASSIGNED);
    }
    if (data.textSource === "random") {
      const difficulty =
        data.difficulty == "easy"
          ? "beginner"
          : data.difficulty == "medium"
            ? "intermediate"
            : "advanced";
      const lesson = await this.lessonRepository.findOne({
        level: difficulty,
      });
      if (!lesson) {
        throw new Error(MESSAGES.LESSON_NOT_FOUND);
      }
      data.contestText = lesson.text;
    }
    if (data.contestMode === "group") {
      const companyGroup = data.targetGroup;
      if (!companyGroup) {
        throw new Error(MESSAGES.GROUP_NOT_FOUND);
      }
      const group = await this._baseRepoCompanyGroup.findById(companyGroup);
      if (!group) {
        throw new Error(MESSAGES.GROUP_NOT_FOUND);
      }
    }

    if (!data.date || !data.startTime) {
      throw new Error(MESSAGES.DATE_OR_START_TIME_REQUIRED);
    }
    const contest = new ContestEntity({
      ...data,
      date: new Date(data.date),
      startTime: new Date(`${data.date}T${data.startTime}:00`),
      duration: Number(data.duration) * 60,
      maxParticipants: Number(data.maxParticipants),
      groupId: data.targetGroup ?? null,
      rewards: data.rewards.map((r) => ({
        rank: r.rank,
        prize: Number(r.prize),
      })),
      CompanyId: companyId,
      countDown: 10,
    });
    const newContest = await this.contestRepository.create(contest);
    return mapContestDTOAdmin(newContest);
  }
}
