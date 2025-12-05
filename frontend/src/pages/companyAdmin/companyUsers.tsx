
import CompanyAdminSidebar from "../../components/companyAdmin/layout/CompanyAdminSideNavbar";
import UsersTable from "../../components/companyAdmin/users/CompanyUsers";
const CompanyUsers: React.FC = () => {
  return (
    <>
    <CompanyAdminSidebar/>
    <UsersTable/>
    </>
  );
};
export default CompanyUsers;
