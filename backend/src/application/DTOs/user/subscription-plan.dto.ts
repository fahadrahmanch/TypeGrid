export interface SubscriptionPlanDTO {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  type: 'normal' | 'company';
  userLimit?: number;
}
