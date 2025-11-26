import LoginNavbar from "../../components/auth/navbar/loginPageNav";
import NewPasswordForm from "../../components/auth/password/NewPassword";
const NewPassword:React.FC=()=>{
    return(
        <>
        <LoginNavbar/>
        <NewPasswordForm/>
        </>
    );
};
export default NewPassword;