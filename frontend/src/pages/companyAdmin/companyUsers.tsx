
import CompanyAdminSidebar from "../../components/companyAdmin/layout/CompanyAdminSideNavbar";
import UsersTable from "../../components/companyAdmin/users/users";
const CompanyUsers: React.FC = () => {
  return (
    <>
    <CompanyAdminSidebar/>
    <UsersTable/>
    </>
  );
};
export default CompanyUsers;
