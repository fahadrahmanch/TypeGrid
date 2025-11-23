import express, { Request, Response } from "express";
import { Routes } from "../../domain/constants/routes";
import { injectUserManageController } from "../DI/admin";
export class adminRouter {
    private router: express.Router;
    constructor(
    ) {
        this.router = express.Router();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(Routes.ADMIN.GET_USERS, (req: Request, res: Response) => {
            injectUserManageController.getUsers(req,res)
        });
    }
    getRouter() {
        return this.router;
    }
}