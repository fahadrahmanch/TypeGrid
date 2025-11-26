import SideNavbar from "../../components/admin/layout/Navbar/SideNabar";
import CompanyList from "../../components/admin/company/CompanyList";
const Company:React.FC=()=>{
    return(
        <>
        <SideNavbar/>
        <CompanyList/>
        
        </>
    );
};
export default Company;