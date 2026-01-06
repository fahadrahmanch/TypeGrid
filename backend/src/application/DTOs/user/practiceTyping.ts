export interface PracticeTypingDTO {
  id: string;
  text: string;
  category: string;
  level: string;
}

export function mapPracticeTypingToDTO(doc: any): PracticeTypingDTO {
  return {
    id: doc._id.toString(),
    text: doc.text,
    category: doc.category,
    level: doc.level
  };
}
