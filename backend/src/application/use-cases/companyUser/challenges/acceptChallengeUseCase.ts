import { IAcceptChallengeUseCase } from "../../interfaces/companyUser/IAcceptChallengeUseCase";
import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { CompanyChallengeEntity } from "../../../../domain/entities/companyChallengeEntity";

export class acceptChallengeUseCase implements IAcceptChallengeUseCase {

  constructor(
    private _baseRepoChallenge: IBaseRepository<any>,
    private _baseRepoCompetition: IBaseRepository<any>,
  ) {}

  async execute(challengeId: string): Promise<void> {


    const challenge = await this._baseRepoChallenge.findById(challengeId)

    if (!challenge) {
      throw new Error("Challenge not found")
    }

    const challengeEntity = new CompanyChallengeEntity(challenge)

    challengeEntity.accept()
    const toObject= challengeEntity.toObject()
    await this._baseRepoChallenge.update(
      {...toObject}
     
    )

  }
}