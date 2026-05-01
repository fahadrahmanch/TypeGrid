import { IConfirmCompanySubscriptionUseCase } from "../../interfaces/admin/confirm-company-subscription.interface";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/repository/admin/subscription-plan.repository.interface";
import { IUserSubscriptionRepository } from "../../../../domain/interfaces/repository/user/user-subscription.repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";
import { ICompanyRepository } from "../../../../domain/interfaces/repository/company/company-repository.interface";
import { UserSubscriptionEntity } from "../../../../domain/entities/user/user-subscription.entity";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { MESSAGES } from "../../../../domain/constants/messages";
import { PaymentEntity } from "../../../../domain/entities/user/payment.entity";
import { IPaymentRepository } from "../../../../domain/interfaces/repository/user/payment.repository.interface";
export class ConfirmCompanySubscriptionUseCase implements IConfirmCompanySubscriptionUseCase {
  constructor(
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    private readonly _userSubscriptionRepository: IUserSubscriptionRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _companyRepository: ICompanyRepository,
    private readonly _paymentRepository: IPaymentRepository
  ) {}
  async execute(userId: string, planId: string, providerTransactionId: string): Promise<void> {
    const plan = await this._subscriptionPlanRepository.findById(planId);
    if (!plan) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.SUBSCRIPTION_PLAN_NOT_FOUND);
    }
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.AUTH_USER_NOT_FOUND);
    }

    if (!user.CompanyId) {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, MESSAGES.USER_NOT_ASSOCIATED_WITH_COMPANY);
    }

    const company = await this._companyRepository.findById(user.CompanyId);
    if (!company) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.COMPANY_NOT_FOUND);
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.getDuration());

    const payment = new PaymentEntity({
      userId,
      amount: plan.getPrice(),
      currency: "usd",
      status: "completed",
      provider: "stripe",
      providerTransactionId,
    });

    const existingPayment = await this._paymentRepository.findOne({ providerTransactionId });
    if (existingPayment) {
      return;
    }

    await this._paymentRepository.create(payment.toObject());

    const existingActiveSub = await this._userSubscriptionRepository.findOne({
      userId,
      status: "active",
      planType: "company",
    });

    if (existingActiveSub) {
      const subId = existingActiveSub.getId();
      if (subId) {
        await this._userSubscriptionRepository.updateById(subId, {
          subscriptionPlanId: planId,
          startDate,
          endDate,
          status: "active",
        });
      }
    } else {
      const userSubscription = new UserSubscriptionEntity({
        userId,
        subscriptionPlanId: planId,
        planType: "company",
        status: "active",
        startDate,
        endDate,
      });

      await this._userSubscriptionRepository.create(userSubscription.toObject());
    }

    await this._companyRepository.updateById(user.CompanyId, {
      status: "active",
      planId: planId,
      startDate,
      endDate,
    });
  }
}
