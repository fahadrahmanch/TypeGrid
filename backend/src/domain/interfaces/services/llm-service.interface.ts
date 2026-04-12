export interface ILlmService {
  generateText(prompt: string): Promise<string>;
}