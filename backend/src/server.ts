import { app } from ".";
const application=new app();
async function startServer(){
    await application.connectDatabase();
    const PORT=process.env.PORT;
    application.app.listen(PORT,()=>{
        console.log("server is running");
    });
}
startServer();