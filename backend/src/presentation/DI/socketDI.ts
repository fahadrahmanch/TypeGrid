import { GroupSocketController } from "../../infrastructure/socket/groupSocketController";
import { RemoveMemberGroupPlayGroupUseCase } from "../../application/use-cases/user/group-play/RemoveMemberGroupPlayGroupUseCase";
import { BaseRepository } from "../../infrastructure/db/base/BaseRepository";
import { Group } from "../../infrastructure/db/models/user/groupSchema";
import { User } from "../../infrastructure/db/models/user/userSchema";
const baseRepoGroup=new BaseRepository(Group)
const baseRepoUser=new BaseRepository(User)
const removeMemberUseCase=new RemoveMemberGroupPlayGroupUseCase(baseRepoGroup,baseRepoUser)
export const injectGroupSocketController =new GroupSocketController(removeMemberUseCase);