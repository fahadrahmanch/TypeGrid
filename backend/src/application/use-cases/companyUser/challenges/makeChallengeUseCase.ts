import { IMakeChallengeUseCase } from "../../interfaces/companyUser/IMakeChallengeUseCase";
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { CompanyChallengeEntity } from "../../../../domain/entities/companyChallengeEntity";
import { CompetitionEntity } from "../../../../domain/entities/CompetitionEntity";
import { ChallengeDTO,mapChallengeToDTO } from "../../../DTOs/companyUser/challengeDTO";
export class makeChallengeUseCase implements IMakeChallengeUseCase {
  constructor(
    private _baseRepoChallenge: IBaseRepository<any>,
    private _baseRepoUser: IBaseRepository<any>,
    private _baseRepoCompetition: IBaseRepository<any>,
    private _baseRepoLesson: IBaseRepository<any>
  ) {}

  async execute(
    senderId: string,
    receiverId: string,
  ): Promise<ChallengeDTO> {

    if (senderId === receiverId) {
      throw new Error("You cannot challenge yourself");
    }

    const sender = await this._baseRepoUser.findById(senderId);
    const receiver = await this._baseRepoUser.findById(receiverId);

    if (!sender || !receiver) {
      throw new Error("Sender or Receiver not found");
    }
    if (!sender.CompanyId || sender.CompanyId.toString() !== receiver.CompanyId.toString()) {
      throw new Error("Both users must belong to same company");
    }
    const levels = ["beginner", "intermediate", "advanced"];

const randomIndex = Math.floor(Math.random() * levels.length);

const level = levels[randomIndex];


    const lesson = await this._baseRepoLesson.findOne({level});

    if (!lesson) {
      throw new Error("Lesson not found");
    }

    const competition = new CompetitionEntity({
      type: "company",
      mode: "company",
      CompanyId: sender.CompanyId,
      participants: [senderId, receiverId],
      duration: 300, // 5 mins
      countDown: 10,
      status: "pending",
      textId: lesson._id
    });

    const savedCompetition = await this._baseRepoCompetition.create(competition.toObject())

    const challenge = new CompanyChallengeEntity({
      CompanyId: sender.CompanyId,
      senderId,
      receiverId,
      status: "pending",
      competitionId: savedCompetition._id.toString()
    });
 
   let Challenge= await this._baseRepoChallenge.create(challenge.toObject());
   const challengeWithOpponent = {
  ...Challenge,
  opponent: sender,
  type: "received"
};
   return mapChallengeToDTO(challengeWithOpponent)
   
  }
}