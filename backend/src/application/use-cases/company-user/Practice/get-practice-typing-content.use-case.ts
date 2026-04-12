import { ILlmService } from "../../../../domain/interfaces/services/llm-service.interface";
import { IGetPracticeTypingContentUseCase } from "../../interfaces/companyUser/get-practice-typing-content.interface";

export class GetPracticeTypingContentUseCase implements IGetPracticeTypingContentUseCase {
  constructor(private llmService: ILlmService) {}

  async execute(prompt: string): Promise<string> {
    if (!prompt) {
      throw new Error("Prompt is required");
    }

    return this.llmService.generateText(prompt);
  }
}