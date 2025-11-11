import express,{Request,Response} from 'express'
import { injectRegisterController } from '../DI/user'
export class userRouter{
    private router:express.Router
    constructor(){
    this.router=express.Router()
    this.initializeRoutes()
    }
    initializeRoutes(){
    this.router.post('/signup',(req:Request,res:Response)=>{
        injectRegisterController.register(req,res)
    })
    }
    getRouter(){
        return this.router
    }
}