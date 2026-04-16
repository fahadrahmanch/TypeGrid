import { SubscriptionDetailsDTO } from '../../../../DTOs/user/subscription-details.dto';

export interface IGetSubscriptionDetailsUseCase {
  execute(userId: string): Promise<SubscriptionDetailsDTO>;
}
