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
import { appEvents } from "../../../events/AppEvents";
export class MakeChallengeUseCase implements IMakeChallengeUseCase {
  constructor(
    private readonly _challengeRepository: ICompanyChallengeRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _competitionRepository: ICompetitionRepository,
    private readonly _lessonRepository: ILessonRepository
  ) {}

  async execute(senderId: string, receiverId: string): Promise<ChallengeDTO> {
    if (senderId === receiverId) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, MESSAGES.CANNOT_CHALLENGE_SELF);
    }

    const sender = await this._userRepository.findById(senderId);
    const receiver = await this._userRepository.findById(receiverId);

    if (!sender || !receiver) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.SENDER_OR_RECEIVER_NOT_FOUND);
    }

    const existingChallenge = await this._challengeRepository.findOne({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
      status: { $in: ["pending", "accepted", "waiting"] },
    });

    if (existingChallenge) {
      throw new CustomError(HttpStatusCodes.CONFLICT, MESSAGES.CHALLENGE_ALREADY_EXISTS);
    }

    if (!sender.CompanyId || sender.CompanyId.toString() !== receiver.CompanyId?.toString()) {
      throw new CustomError(HttpStatusCodes.FORBIDDEN, MESSAGES.USERS_MUST_BELONG_TO_SAME_COMPANY);
    }

    const levels = ["beginner", "intermediate", "advanced"];
    const level = levels[Math.floor(Math.random() * levels.length)];

    const lesson = await this._lessonRepository.findOne({ level });
    if (!lesson) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.LESSON_NOT_FOUND);
    }

    // Creating new record — new CompetitionEntity() is correct here
    const competitionEntity = new CompetitionEntity({
      type: "company",
      mode: "company",
      CompanyId: sender.CompanyId,
      participants: [senderId, receiverId],
      duration: 300,
      countDown: 10,
      status: "pending",
      textId: lesson._id?.toString(),
    });

    const savedCompetition = await this._competitionRepository.create(competitionEntity.toObject());

    // Creating new record — new CompanyChallengeEntity() is correct here
    const challengeEntity = new CompanyChallengeEntity({
      CompanyId: sender.CompanyId!,
      senderId,
      receiverId,
      status: "pending",
      competitionId: savedCompetition.getId()?.toString(),
    });

    const savedChallenge = await this._challengeRepository.create(challengeEntity.toObject());

    const challegeDTO = mapChallengeToDTO({
      ...savedChallenge.toObject(),
      opponent: {
        _id: sender._id,
        name: sender.name,
        email: sender.email,
        imageUrl: sender.imageUrl,
        CompanyRole: sender.CompanyRole,
      },
      type: "received",
    });
    appEvents.emit("challenge.created", {
      receiverId,
      challenge: challegeDTO,
    });

    return challegeDTO;
  }
}
