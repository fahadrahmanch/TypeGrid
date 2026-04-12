import { IGetProfileUseCase } from "../interfaces/companyUser/get-profile.interface";
import { IUserRepository } from "../../../domain/interfaces/repository/user/user-repository.interface";
import { ICompanyRepository } from "../../../domain/interfaces/repository/company/company-repository.interface";
import { ICompanyUserStatsRepository } from "../../../domain/interfaces/repository/company/company-user-stats-repository.interface";
import { ILessonResultRepository } from "../../../domain/interfaces/repository/company/lesson-result-repository.interface";
import { CompanyUserProfileDTO } from "../../DTOs/companyUser/company-user-profile.dto";
import { mapToCompanyUserProfileDTO } from "../../mappers/companyUser/company-user-profile.mapper";

export class GetProfileUseCase implements IGetProfileUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly companyRepository: ICompanyRepository,
    private readonly statsRepository: ICompanyUserStatsRepository,
    private readonly lessonResultRepository: ILessonResultRepository,
  ) {}

  async getProfile(userId: string): Promise<CompanyUserProfileDTO | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) return null;

    let companyName = "Unknown Company";
    if (user.CompanyId) {
      const company = await this.companyRepository.findById(
        user.CompanyId.toString(),
      );
      if (company) {
        companyName = company.companyName || "Unknown Company";
      }
    }

    const stats = await this.statsRepository.findOne({ userId });
    const completedLessonsCount =
      await this.lessonResultRepository.countCompletedLessons(userId);

    const avgSpeed = stats?.getWpm() || 0;
    const accuracy = stats?.getAccuracy() || 0;

    return mapToCompanyUserProfileDTO(
      user,
      companyName,
      avgSpeed,
      accuracy,
      completedLessonsCount,
    );
  }
}
