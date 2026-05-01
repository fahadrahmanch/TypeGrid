export interface UserProfileDTO {
  _id?: string;
  name: string;
  email: string;
  imageUrl?: string;
  bio?: string;
  age?: string;
  number?: string;
  KeyBoardLayout: "QWERTY" | "AZERTY" | "DVORAK";
  status?: "active" | "block";
  contactNumber?: number;
  gender?: string;
  role: "user" | "admin" | "companyUser" | "companyAdmin";
  level?: number;
  joinedAt?: Date;
  performance?: {
    averageSpeed: number;
    accuracy: number;
    competitions: number;
  };
}
