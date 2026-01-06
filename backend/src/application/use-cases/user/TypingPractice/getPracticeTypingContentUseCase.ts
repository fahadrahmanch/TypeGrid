import { IGetPracticeTypingContentUseCase } from "../../../../domain/interfaces/useCases/user/TypingPracticeUseCases/IGetPracticeTypingContentUseCase";
import { IBaseRepository } from "../../../../domain/interfaces/repository/user/IBaseRepository";
import { PracticeTypingDTO } from "../../../DTOs/user/practiceTyping";
import { mapPracticeTypingToDTO } from "../../../DTOs/user/practiceTyping";
export class getPracticeTypingContentUseCase implements IGetPracticeTypingContentUseCase{
    constructor(
    private  _baseRepoLesson:IBaseRepository<any>
    ){}
    async execute(level: string, category: string): Promise<PracticeTypingDTO> {
        if (!level || !category) {
            throw new Error("Level and Category are required");
        }
        const lessons = await this._baseRepoLesson.find({ level, category });
        if (lessons.length === 0) {
            throw new Error("No lessons found for the given level and category");
        }
        const randomIndex = Math.floor(Math.random() * lessons.length);
        const selectedLesson = lessons[randomIndex];
        return mapPracticeTypingToDTO(selectedLesson);
    }

    async getLessonById(lessonId:string):Promise<PracticeTypingDTO>{
      const lesson= await this._baseRepoLesson.findById(lessonId);
      if(!lesson){
        throw new Error("Lesson not found");
      }
      return mapPracticeTypingToDTO(lesson);
    }

}
