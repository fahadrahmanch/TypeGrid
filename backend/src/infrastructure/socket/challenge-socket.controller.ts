import { IStartChallengeUseCase } from "../../application/use-cases/interfaces/companyUser/start-challenge.interface";
export class ChallengeSocketController {
  constructor(private _startChallengeUseCase: IStartChallengeUseCase) {}
  async execute(challengeId: string): Promise<void> {
    if (!challengeId) {
      return;
    }
    await this._startChallengeUseCase.execute(challengeId);
  }
}
