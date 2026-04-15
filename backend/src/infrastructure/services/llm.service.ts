import Groq from "groq-sdk";
import { ILlmService } from "../../domain/interfaces/services/llm-service.interface";

export class LLMService implements ILlmService {
  private client: Groq;

  constructor() {
    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
      throw new Error("GROK_API_KEY is not defined in environment variables");
    }
    this.client = new Groq({ apiKey });
  }

  async generateText(prompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `Generate a clean, simple, 50-word typing paragraph. Avoid special characters. Topic: ${prompt}`,
        },
      ],
      max_tokens: 200,
    });

    return response.choices[0]?.message?.content ?? "";
  }
}