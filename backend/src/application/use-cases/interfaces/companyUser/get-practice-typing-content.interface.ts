
export interface IGetPracticeTypingContentUseCase {
  execute(prompt: string): Promise<string>;
}