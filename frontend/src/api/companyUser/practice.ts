import { companyAPI } from "../axios/companyAPI";

export async function generatePracticeText(prompt: string) {
  // Assuming a backend endpoint will be created for this
  // For now, it might return a mock text or call a real endpoint if it exists
  return companyAPI.post("/typing/generate-text", { prompt });
}

export async function getQuickPracticeTexts(category: string) {
  return companyAPI.get(`/typing/practice/quick?category=${category}`);
}
