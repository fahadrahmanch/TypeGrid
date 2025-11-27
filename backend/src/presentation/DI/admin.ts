import { getUsersUseCase } from "../../application/use-cases/admin/getUsersUseCase";
import { userManageController } from "../controllers/admin/userManageController";
import { authRepository } from "../../infrastructure/db/repositories/auth/authRepository";
const authRepo = new authRepository();
const GetUsers = new getUsersUseCase(authRepo);
export const injectUserManageController = new userManageController(GetUsers);
