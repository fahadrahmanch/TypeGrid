export interface CreateSubscriptionPlanDTO {
  name: string;
  price: number | string;
  duration: "monthly" | "yearly";
  features: string[];
  type: "normal" | "company";
  userLimit?: number | string;
}

export interface SubscriptionPlanResponseDTO {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  type: "normal" | "company";
  userLimit?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
