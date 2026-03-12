import { IMakeChallengeUseCase } from "../../interfaces/companyUser/make-challenge.interface";
import { ICompanyChallengeRepository } from "../../../../domain/interfaces/repository/company/company-challenge-repository.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { ICompetitionRepository } from "../../../../domain/interfaces/repository/user/competition-repository.interface";
import { ILessonRepository } from "../../../../domain/interfaces/repository/admin/lesson-repository.interface";
import { CompanyChallengeEntity } from "../../../../domain/entities/company-challenge.entity";
import { CompetitionEntity } from "../../../../domain/entities/competition.entity";
import { ChallengeDTO } from "../../../DTOs/companyUser/challenge.dto";
import { mapChallengeToDTO } from "../../../mappers/companyUser/challenge.mapper";
/**
 * Use case for creating a company challenge.
 */
export class MakeChallengeUseCase implements IMakeChallengeUseCase {
  constructor(
    private readonly _challengeRepository: ICompanyChallengeRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _competitionRepository: ICompetitionRepository,
    private readonly _lessonRepository: ILessonRepository,
  ) {}
  /**
   * Create a challenge between two users.
   */
  async execute(senderId: string, receiverId: string): Promise<ChallengeDTO> {
    if (senderId === receiverId) {
      throw new CustomError(
        HttpStatusCodes.BAD_REQUEST,
        MESSAGES.CANNOT_CHALLENGE_SELF,
      );
    }

    const sender = await this._userRepository.findById(senderId);
    const receiver = await this._userRepository.findById(receiverId);

    if (!sender || !receiver) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.SENDER_OR_RECEIVER_NOT_FOUND,
      );
    }
    if (
      !sender.CompanyId ||
      sender.CompanyId.toString() !== receiver.CompanyId.toString()
    ) {
      throw new CustomError(
        HttpStatusCodes.FORBIDDEN,
        MESSAGES.USERS_MUST_BELONG_TO_SAME_COMPANY,
      );
    }
    const levels = ["beginner", "intermediate", "advanced"];

    const randomIndex = Math.floor(Math.random() * levels.length);

    const level = levels[randomIndex];

    const lesson = await this._lessonRepository.findOne({ level });

    if (!lesson) {
      throw new CustomError(
        HttpStatusCodes.NOT_FOUND,
        MESSAGES.LESSON_NOT_FOUND,
      );
    }

    const competition = new CompetitionEntity({
      type: "company",
      mode: "company",
      CompanyId: sender.CompanyId,
      participants: [senderId, receiverId],
      duration: 300, // 5 mins
      countDown: 10,
      status: "pending",
      textId: lesson._id || lesson.id,
    });

    const savedCompetition =
      await this._competitionRepository.create(competition);

    const challenge = new CompanyChallengeEntity({
      CompanyId: sender.CompanyId!,
      senderId,
      receiverId,
      status: "pending",
      competitionId: savedCompetition._id
        ? savedCompetition._id.toString()
        : savedCompetition.id.toString(),
    });

    let Challenge = await this._challengeRepository.create(challenge);
    const challengeWithOpponent = {
      ...Challenge,
      opponent: sender,
      type: "received",
    };
    return mapChallengeToDTO(challengeWithOpponent);
  }
}
