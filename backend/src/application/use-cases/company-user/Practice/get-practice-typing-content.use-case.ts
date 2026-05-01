import { ILlmService } from "../../../../domain/interfaces/services/llm-service.interface";
import { IGetPracticeTypingContentUseCase } from "../../interfaces/companyUser/get-practice-typing-content.interface";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../../domain/constants/messages";

export class GetPracticeTypingContentUseCase implements IGetPracticeTypingContentUseCase {
  constructor(private llmService: ILlmService) {}

  async execute(prompt: string): Promise<string> {
    if (!prompt) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, MESSAGES.PROMPT_REQUIRED);
    }

    return this.llmService.generateText(prompt);
  }
}
