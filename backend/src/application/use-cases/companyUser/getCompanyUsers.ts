import { IGetCompanyUsers } from "../interfaces/companyUser/IGetCompanyUsers";
import { IBaseRepository } from "../../../domain/interfaces/repository/IBaseRepository";
import { MESSAGES } from "../../../domain/constants/messages";
import { companyUserDTO,mapCompanyUsersWithOnlineStatus } from "../../DTOs/companyUser/companyUserDto";
import redis from "../../../config/redis";

export class getCompanyUsers implements IGetCompanyUsers{
    constructor(
    private _baseRepoUser:IBaseRepository<any>,
    ){}
    async execute(userId:string):Promise<companyUserDTO[]>{
    const user=await this._baseRepoUser.findById(userId)
    if(!user){
        throw new Error(MESSAGES.AUTH_USER_NOT_FOUND)
    }
    const companyId=user.CompanyId
    const users=await this._baseRepoUser.find({CompanyId:companyId})
    const onlineUsers = await redis.smembers("online:users");
    return mapCompanyUsersWithOnlineStatus(users,onlineUsers)
    }
}