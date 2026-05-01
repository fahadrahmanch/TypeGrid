import { ICompanyChallengeRepository } from "../../../../domain/interfaces/repository/company/company-challenge-repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { IGetChallengesUseCase } from "../../interfaces/companyUser/get-challenges.interface";
import { ChallengeDTO } from "../../../DTOs/companyUser/challenge.dto";
import { mapChallengeToDTO } from "../../../mappers/companyUser/challenge.mapper";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../../domain/constants/messages";

/**
 * Use case for retrieving challenges for a user.
 */
export class GetChallengesUseCase implements IGetChallengesUseCase {
  constructor(
    private readonly challengeRepository: ICompanyChallengeRepository,
    private readonly userRepository: IUserRepository
  ) {}

  /**
   * Get all sent and received challenges.
   * @param userId - User identifier
   */
  async execute(userId: string): Promise<ChallengeDTO[]> {
    if (!userId) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, MESSAGES.INVALID_REQUEST);
    }

    const [sentChallenges, receivedChallenges] = await Promise.all([
      this.challengeRepository.find({ senderId: userId }),
      this.challengeRepository.find({ receiverId: userId }),
    ]);

    const processChallenges = async (challenges: any[], type: "sent" | "received") => {
      return Promise.all(
        challenges.map(async (item) => {
          const opponentId = type === "sent" ? item.receiverId : item.senderId;

          const opponent = await this.userRepository.findById(opponentId);

          return {
            ...item,
            type: item.status === "completed" ? "completed" : type,
            opponent,
          };
        })
      );
    };

    const [sent, received] = await Promise.all([
      processChallenges(sentChallenges, "sent"),
      processChallenges(receivedChallenges, "received"),
    ]);

    return [...sent, ...received].map(mapChallengeToDTO);
  }
}
