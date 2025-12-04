import { useEffect, useState } from "react";
import { getCompanyStatus } from "../../../api/user/userService";
import { useNavigate } from "react-router-dom";
const CompanyVerificationStatusDiv1: React.FC = () => {
  const [company,setCompany]=useState<any>()
  const navigate = useNavigate();
  useEffect(()=>{
    async function fetchCompanyDetails(){
      try{
        const response=await getCompanyStatus() 
        console.log(response.data)
        if(!response.data){
          return navigate('/')
        }
        setCompany(response.data.company)

      }catch(error){
       console.log(error)
       navigate('/')

      }
    
    }
    fetchCompanyDetails()
  },[])
  return (
    <>
      <div className="min-h-screen mt-12 flex flex-col items-center pt-10 px-4">
        <div className="w-full max-w-2xl space-y-6">
          {/* 1. Yellow Status Banner */}

          {company?.status === "pending" && (
            <div className="bg-[#FFFBEB] border-2 border-[#FEF3C7] rounded-xl p-6 flex items-start gap-5 shadow-sm">
              <div className="text-4xl">⏳</div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Verification Pending
                </h2>
                <p className="text-gray-600 mt-1">
                  Your company verification is in progress. Please wait for
                  approval.
                </p>
              </div>
            </div>
          )}
          {company?.status === "active" && (
            <div className="bg-[#ECFDF5] border-2 border-[#A7F3D0] rounded-xl p-6 flex items-start gap-5 shadow-sm">
              <div className="text-4xl">🎉</div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Company Approved!
                </h2>
                <p className="text-gray-600 mt-1">
                  Your company is now active. You can continue using your
                  dashboard features.
                </p>
              </div>
            </div>
          )}
          {company?.status === "rejected" && (
            <div className="bg-[#FEF2F2] border-2 border-[#FECACA] rounded-xl p-6 flex items-start gap-5 shadow-sm">
              <div className="text-4xl">⚠️</div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Verification Failed
                </h2>
                <p className="text-gray-600 mt-1">
                  Your submission was rejected. Please review and resubmit your
                  company details.
                </p>
              </div>
            </div>
          )}

          {/* 2. Information Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Submitted Information
            </h3>

            <div className="flex flex-col">
              {/* Row 1 */}
              <div className="flex justify-between items-start py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium">Company Name</span>
                <span className="text-gray-900 font-semibold text-right">
                  {company?.companyName}
                </span>
              </div>

              {/* Row 2 */}
              <div className="flex justify-between items-start py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium">Address</span>
                <span className="text-gray-900 font-semibold text-right max-w-[60%]">
                  {company?.address}
                </span>
              </div>

              {/* Row 3 */}
              {/* <div className="flex justify-between items-start py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium">
                  Contact Person
                </span>
                <span className="text-gray-900 font-semibold text-right">
                  Fahad Rahman
                </span>
              </div> */}

              {/* Row 4 */}
              <div className="flex justify-between items-start py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium">Email</span>
                <span className="text-gray-900 font-semibold text-right">
                  {company?.email}
                </span>
              </div>

              {/* Row 5 */}
              <div className="flex justify-between items-start py-4 border-b border-gray-100">
                <span className="text-gray-400 font-medium">Phone</span>
                <span className="text-gray-900 font-semibold text-right">
                  {company?.number}
                </span>
              </div>

              {/* Row 6 */}
              <div className="flex justify-between items-start py-4">
                <span className="text-gray-400 font-medium">Submitted</span>
                <span className="text-gray-900 font-semibold text-right">
                  {company?.createdAt &&
                    new Date(company.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Action Button */}
          <button className="w-full bg-[#1C5CE5] hover:bg-blue-700 text-white font-semibold py-3.5 rounded-lg transition-colors shadow-sm">
            Back to Home
          </button>
        </div>
      </div>
    </>
  );
};
export default CompanyVerificationStatusDiv1;
