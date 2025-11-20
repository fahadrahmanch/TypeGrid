import UserList from "../../components/admin/user/userList"
import SideNavbar from "../../components/admin/layout/Navbar/SideNabar"
const Users: React.FC = () => {
    return (
        <>
        <SideNavbar/>
            <UserList />
        </>
    )
}
export default Users