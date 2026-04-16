export interface UserSubscriptionDetailsDTO {
  planId: string;
  planName: string;
  status: string;
  startDate?: Date;
  endDate?: Date;
  type: 'normal' | 'company';
}

export interface SubscriptionDetailsDTO {
  personalSubscription?: UserSubscriptionDetailsDTO;
  companySubscription?: {
    companyId: string;
    companyName: string;
    subscription: UserSubscriptionDetailsDTO;
  };
}
