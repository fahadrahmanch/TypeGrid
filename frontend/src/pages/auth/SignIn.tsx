import LoginNavbar from "../../components/auth/navbar/loginPageNav";
import { SignInForm } from "../../components/auth/login/loginForm";
const SignIn: React.FC = () => {
    return (
        <>
            <LoginNavbar />
            <SignInForm />
        </>
    );
};
export default SignIn;