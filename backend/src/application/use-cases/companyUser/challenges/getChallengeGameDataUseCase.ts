import { IGetChallengeGameDataUseCase } from "../../interfaces/companyUser/IGetChallengeGameDataUseCase";
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { ChallengeGameDTO, mapChallengeGameToDTO } from "../../../DTOs/companyUser/challengeDTO";

export class GetChallengeGameDataUseCase implements IGetChallengeGameDataUseCase {

  constructor(
    private _baseRepoChallenge: IBaseRepository<any>,
    private _baseRepoCompetition: IBaseRepository<any>,
    private _baseRepoUser: IBaseRepository<any>,
    private _baseRepoLesson: IBaseRepository<any>
  ) {}

  async execute(challengeId: string): Promise<ChallengeGameDTO> {

    const challenge = await this._baseRepoChallenge.findById(challengeId)

    if (!challenge) {
      throw new Error("Challenge not found")
    }

    const senderId = challenge.senderId.toString()
    const receiverId = challenge.receiverId.toString()
    const competitionId = challenge.competitionId.toString()

    const competition = await this._baseRepoCompetition.findById(competitionId)

    if (!competition) {
      throw new Error("Competition not found")
    }

    const updatedCompetition = await this._baseRepoCompetition.update({
      _id: competitionId,
      startedAt: new Date()
    })

    const [player1, player2, lesson] = await Promise.all([
      this._baseRepoUser.findById(senderId),
      this._baseRepoUser.findById(receiverId),
      this._baseRepoLesson.findById(competition.textId)
    ])

    if (!player1 || !player2) {
      throw new Error("Player not found")
    }

    if (!lesson) {
      throw new Error("Lesson not found")
    }

    const players = [player1, player2]

    const data = {
      competition: updatedCompetition,
      lesson,
      players
    }

    const result = mapChallengeGameToDTO(data)

    return result
  }
}