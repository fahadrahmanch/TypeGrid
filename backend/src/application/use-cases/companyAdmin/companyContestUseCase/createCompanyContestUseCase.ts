import { IBaseRepository } from "../../../../domain/interfaces/repository/IBaseRepository";
import { ICreateCompanyContestUseCase } from "../../interfaces/companyAdmin/ICreateCompanyContestUseCase";
import { CreateContestDTO } from "../../../DTOs/companyAdmin/CompanyContestDTO";
import { ContestEntity } from "../../../../domain/entities/companyContestEntity";
import { mapContestDTOAdmin } from "../../../DTOs/companyAdmin/CompanyContestDTO";
export class createCompanyContestUseCase implements ICreateCompanyContestUseCase {
    constructor(
        private _baseRepoUser: IBaseRepository<any>,
        private _baseRepoCompanyGroup: IBaseRepository<any>,
        private _baseRepoContest: IBaseRepository<any>,
        private _baseRepoLesson: IBaseRepository<any>,
    ) { }

    async execute(data: CreateContestDTO, userId: string): Promise<CreateContestDTO> {
        const user=await this._baseRepoUser.findById(userId);
        if(!user){
            throw new Error("User not found");
        }
        const companyId=user.CompanyId;
        if (data.textSource === "random") {
            const difficulty = data.difficulty == "easy" ? "beginner" : data.difficulty == "medium" ? "intermediate" : "advanced";
            const lesson = await this._baseRepoLesson.findOne({ level: difficulty });
            if (!lesson) {
                throw new Error("Lesson not found");
            }
            data.contestText = lesson.text;

        }
        if (data.contestMode === "group") {
            const companyGroup = data.targetGroup;
            if (!companyGroup) {
                throw new Error("Group not found");
            }
            const group = await this._baseRepoCompanyGroup.findById(companyGroup);
            if (!group) {
                throw new Error("Group not found");
            }
        }


if (!data.date || !data.startTime) {
   throw new Error("Date or Start Time missing");
}
        const contest = new ContestEntity({
            ...data,
            date: new Date(data.date),
            startTime:new Date(`${data.date}T${data.startTime}:00`),
            duration: Number(data.duration)*60,
            maxParticipants: Number(data.maxParticipants),
            groupId: data.targetGroup ?? null,
            rewards: data.rewards.map(r => ({
                rank: r.rank,
                prize: Number(r.prize),
            })),
            CompanyId:companyId,
            countDown:10
        });
      const newContest=  await this._baseRepoContest.create(contest);
      return mapContestDTOAdmin(newContest)
    }


}