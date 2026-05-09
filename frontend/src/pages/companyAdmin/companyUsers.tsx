import React from "react";
import CompanyAdminSidebar from "../../components/companyAdmin/layout/CompanyAdminSideNavbar";
import UsersTable from "../../components/companyAdmin/users/CompanyUsers";

const CompanyUsers: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#FFF8EA]">
      <CompanyAdminSidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-12 overflow-y-auto pt-24 md:pt-12">
        <div className="max-w-7xl mx-auto">
          <UsersTable />
        </div>
      </main>
    </div>
  );
};

export default CompanyUsers;
