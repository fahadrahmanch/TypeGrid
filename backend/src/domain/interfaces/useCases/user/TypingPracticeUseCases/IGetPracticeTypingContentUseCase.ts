import { PracticeTypingDTO } from "../../../../../application/DTOs/user/practiceTyping";

export interface IGetPracticeTypingContentUseCase {
    execute(level:string,category:string):Promise<PracticeTypingDTO>
    getLessonById(lessonId:string):Promise<PracticeTypingDTO>
}