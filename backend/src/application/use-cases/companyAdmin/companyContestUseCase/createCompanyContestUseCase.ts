import { IUserRepository } from "../../../../domain/interfaces/repository/user/IUserRepository";
import { ICompanyGroupRepository } from "../../../../domain/interfaces/repository/company/ICompanyGroupRepository";
import { IContestRepository } from "../../../../domain/interfaces/repository/company/IContestRepository";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/ILessonRepository";
import { ICreateCompanyContestUseCase } from "../../interfaces/companyAdmin/ICreateCompanyContestUseCase";
import { CreateContestDTO } from "../../../DTOs/companyAdmin/CompanyContestDTO";
import { ContestEntity } from "../../../../domain/entities/companyContestEntity";
import { mapContestDTOAdmin } from "../../../DTOs/companyAdmin/CompanyContestDTO";
import { MESSAGES } from "../../../../domain/constants/messages";
export class createCompanyContestUseCase implements ICreateCompanyContestUseCase {
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
    return mapContestDTOAdmin(newContest as any);
  }
}
