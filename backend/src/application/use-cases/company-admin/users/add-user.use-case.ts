import { IAddUserUseCase } from "../../interfaces/companyAdmin/add-user.interface";
import { AuthUserEntity } from "../../../../domain/entities";
import { IHashService } from "../../../../domain/interfaces/services/hash-service.interface";
import { MESSAGES } from "../../../../domain/constants/messages";
import { CustomError } from "../../../../domain/entities/custom-error.entity";
import { HttpStatusCodes } from "../../../../domain/enums/http-status-codes.enum";
import { AddUserDTO } from "../../../DTOs/companyAdmin/add-uset.dto";
import { IAuthRepository } from "../../../../domain/interfaces/repository/user/auth-repository.interface";
import { ICompanyRepository } from "../../../../domain/interfaces/repository/company/company-repository.interface";
import { IUserSubscriptionRepository } from "../../../../domain/interfaces/repository/user/user-subscription.repository.interface";
import { ISubscriptionPlanRepository } from "../../../../domain/interfaces/repository/admin/subscription-plan.repository.interface";
import { IUserRepository } from "../../../../domain/interfaces/repository/user/user-repository.interface";

/**
 * Use case responsible for creating a new company user.
 * Guards:
 *  1. Company must exist and be active.
 *  2. The company owner's subscription must be active and not expired.
 *  3. The current number of company users must be below the plan's userLimit.
 */

export class AddUserUseCase implements IAddUserUseCase {
  constructor(
    private readonly _authRepository: IAuthRepository,
    private readonly _hashService: IHashService,
    private readonly _companyRepository: ICompanyRepository,
    private readonly _userSubscriptionRepository: IUserSubscriptionRepository,
    private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository,
    private readonly _userRepository: IUserRepository,
  ) {}

  async addUser(data: AddUserDTO): Promise<AuthUserEntity> {
    const company = await this._companyRepository.findById(data.CompanyId);
    if (!company) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.COMPANY_NOT_FOUND);
    }
    if (company.status !== "active") {
      throw new CustomError(HttpStatusCodes.FORBIDDEN, MESSAGES.COMPANY_ACCOUNT_INACTIVE);
    }

    const ownerSubscription = await this._userSubscriptionRepository.findActive(
      company.OwnerId!,
    );
    if (!ownerSubscription) {
      throw new CustomError(HttpStatusCodes.FORBIDDEN, MESSAGES.SUBSCRIPTION_NOT_FOUND);
    }

    const endDate = ownerSubscription.getEndDate();
    if (!endDate || endDate < new Date()) {
      throw new CustomError(HttpStatusCodes.FORBIDDEN, MESSAGES.SUBSCRIPTION_EXPIRED);
    }

    const subscriptionPlan = await this._subscriptionPlanRepository.findById(
      ownerSubscription.getSubscriptionPlanId(),
    );
    if (!subscriptionPlan) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.SUBSCRIPTION_PLAN_NOT_FOUND);
    }

    const userLimit = subscriptionPlan.getUserLimit();
    if (userLimit !== undefined) {
      const currentUsers = await this._userRepository.getCompanyUsers("", data.CompanyId);
      if (currentUsers.length >= userLimit) {
        throw new CustomError(HttpStatusCodes.FORBIDDEN, MESSAGES.USER_LIMIT_REACHED);
      }
    }

    const existingUser = await this._authRepository.findByEmail(data.email);
    if (existingUser) {
      throw new CustomError(HttpStatusCodes.CONFLICT, MESSAGES.AUTH_EMAIL_EXISTS);
    }

    const hashedPassword = await this._hashService.hash(data.password);

    const newUser = new AuthUserEntity({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      CompanyId: data.CompanyId,
      role: data.role || "companyUser",
      KeyBoardLayout: "QWERTY",
      status: "active",
    });

    return await this._authRepository.create(newUser);
  }
}
