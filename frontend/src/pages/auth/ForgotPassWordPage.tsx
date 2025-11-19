import ForgotPassWordForm from "../../components/auth/password/forgotPassword"
import LoginNavbar from "../../components/auth/navbar/loginPageNav"
const ForgotPassword: React.FC = () => {
    return (
        <>
            <LoginNavbar />
            <ForgotPassWordForm />
        </>
    )
}
export default ForgotPassword