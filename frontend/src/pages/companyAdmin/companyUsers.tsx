import React from "react";
import CompanyAdminSidebar from "../../components/companyAdmin/layout/CompanyAdminSideNavbar";
import UsersTable from "../../components/companyAdmin/users/CompanyUsers";

const CompanyUsers: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#FFF8EA]">
      <CompanyAdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <UsersTable />
        </div>
      </main>
    </div>
  );
};

export default CompanyUsers;
