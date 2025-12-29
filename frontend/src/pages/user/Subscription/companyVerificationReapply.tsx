import React, { useEffect, useState } from "react";
import { reApplyCompanyDetails } from "../../../api/user/userService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  nameValidation,
  emailValidation,
  addressValidation,
  numberValidation,
} from "../../../validations/companyRequestFormValidations";
import { getCompanyStatus } from "../../../api/user/userService";
const CompanyVerificationReapply: React.FC = ({}) => {
  const navigate = useNavigate();
   const [values, setValues] = useState<any>({
    companyName: "",
    address: "",
    email: "",
    number: "",
  });
 
   useEffect(()=>{
     async function fetchCompanyDetails(){
       try{
         const response=await getCompanyStatus(); 
         console.log("response",response)
         if(!response.data){
           return navigate("/");
         }
         const company=response.data.company
         setValues({
            companyName:company.companyName,
            address:company.address,
            email:company.email,
            number:company.number
         });
 
       }catch(error){
        console.log(error);
        navigate("/");
 
       }
     
     }
     fetchCompanyDetails();
   },[]);
 

  const [error, setError] = useState({
    companyName: "",
    email: "",
    number: "",
    address: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nameErr = nameValidation(values.companyName);
    const emailErr = emailValidation(values.email);
    const addressErr = addressValidation(values.address);
    const numberErr = numberValidation(values.number);

    setError({
      companyName: nameErr,
      email: emailErr,
      address: addressErr,
      number: numberErr,
    });

    if (nameErr || emailErr || addressErr || numberErr) return;

    try {
      await reApplyCompanyDetails(values);
      toast.success("Company details submitted for verification");
      navigate("/company/status");
    } catch (err) {
      toast.error("Something went wrong. Try again");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 ">
  <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 border border-gray-100">

    {/* Re-Apply Info Banner */}
    <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
      <div className="text-2xl">🔁</div>
      <div>
        <h3 className="font-semibold text-yellow-800">
          Re-Apply for Verification
        </h3>
        <p className="text-sm text-yellow-700">
          Your previous request was rejected or expired.  
          Please review and submit updated company details.
        </p>
      </div>
    </div>

    {/* Header */}
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Re-Apply Company Verification
      </h1>
      <p className="text-gray-500 text-sm">
        Make sure all details are correct before submitting again.
      </p>
    </div>

    {/* Form */}
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Company Name */}
      <div>
        <label className="block text-sm font-bold mb-2 text-start">
          Company Name *
        </label>
        <input
          type="text"
          name="companyName"
          value={values.companyName}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border"
        />
        <p className="text-red-500 text-sm text-start">{error.companyName}</p>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-bold mb-2 text-start">
          Address *
        </label>
        <input
          type="text"
          name="address"
          value={values.address}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border"
        />
        <p className="text-red-500 text-sm text-start">{error.address}</p>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-bold mb-2 text-start">
          Contact Email *
        </label>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border"
        />
        <p className="text-red-500 text-sm text-start">{error.email}</p>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-bold mb-2 text-start">
          Contact Phone *
        </label>
        <input
          type="tel"
          name="number"
          value={values.number}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border"
        />
        <p className="text-red-500 text-sm text-start">{error.number}</p>
      </div>

      {/* Button */}
      <button
        type="submit"
        className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold transition"
      >
        Re-Apply for Verification
      </button>
    </form>
  </div>
</div>

  );
};

export default CompanyVerificationReapply;
