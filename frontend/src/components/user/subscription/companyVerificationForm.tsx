import { useState } from "react";
import { CompanyDetailsApi } from "../../../api/user/userService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { nameValidation,emailValidation,addressValidation,numberValidation } from "../../../validations/companyRequestFormValidations";
const CompanyVerificationFormDiv: React.FC = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    companyName: "",
    address: "",
    email: "",
    number:""
  });

    const [error, setError] = useState({
    companyName: "",
    email: "",
    number: "",
    address: "",
  });
  function handleChange(e: any) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }
  async function handleSubmit(e: any) {
    e.preventDefault();
        const nameErr = nameValidation(values.companyName);
        const emailErr = emailValidation(values.email);
        const addressErr = addressValidation(values.address);
        const numberErr = numberValidation(values.number)
    
        setError({
          companyName: nameErr,
          email: emailErr,
          address: addressErr,
          number: numberErr,
        });
    
        if (nameErr || emailErr || addressErr || numberErr) return;
    try {
      const response = await CompanyDetailsApi(values);

    toast.success(response?.data?.message || "Company details submitted!");

    
    navigate("/subscription/company/verify/status");
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <div className="min-h-screen  flex items-center justify-center p-4">
        {/* Main Card Container */}
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Company Details
            </h1>
            <p className="text-gray-500 text-sm">
              Submit your information for verification
            </p>
          </div>
          {/* Form Fields */}
          <form className="space-y-5">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 text-start">
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                onChange={handleChange}
                placeholder="Your company name"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder-gray-400 text-gray-700"
              />
              <p className="text-left text-red-500 text-sm">{error.companyName}</p>
            </div>
            {/* Address */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 text-start">
                Address *
              </label>
              <input
                type="text"
                name="address"
                onChange={handleChange}
                placeholder="Street address, city, state, zip"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder-gray-400 text-gray-700"
              />
              <p className="text-left text-red-500 text-sm">{error.address}</p>
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 text-start">
                Contact Email *
              </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="email@company.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder-gray-400 text-gray-700"
              />
              <p className="text-left text-red-500 text-sm">{error.email}</p>
            </div>
            {/* Contact Phone */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 text-start">
                Contact Phone *
              </label>
              <input
                type="tel"
                name="number"
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder-gray-400 text-gray-700"
              />
              <p className="text-left text-red-500 text-sm">{error.number}</p>
            </div>
            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-[#1C5CE5] hover:bg-blue-700 text-white font-semibold py-3.5 rounded-lg transition-colors duration-200 shadow-sm"
              >
                Submit for Verification
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default CompanyVerificationFormDiv;
