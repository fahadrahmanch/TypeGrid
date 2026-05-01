import React, { useEffect, useState, useRef } from "react";
import { reVerifyCompanyApi } from "../../../api/user/userService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { FileUp, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import {
  nameValidation,
  emailValidation,
  addressValidation,
  numberValidation,
} from "../../../validations/companyRequestFormValidations";
import { getCompanyStatusApi } from "../../../api/user/userService";

const CompanyVerificationReapply: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [values, setValues] = useState<any>({
    companyName: "",
    address: "",
    email: "",
    number: "",
    document: "",
  });

  const [error, setError] = useState({
    companyName: "",
    email: "",
    number: "",
    address: "",
    document: "",
  });

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function fetchCompanyDetails() {
      try {
        const response = await getCompanyStatusApi();
        if (!response.data) {
          return navigate("/");
        }
        const company = response.data.company;
        setValues({
          companyName: company.companyName,
          address: company.address,
          email: company.email,
          number: company.number,
          document: company.document || "",
        });
      } catch (error) {
        console.log(error);
        navigate("/");
      }
    }
    fetchCompanyDetails();
  }, [navigate]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large. Max 5MB allowed.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading document...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "UMS-MERN");

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dbo7vvi5z/image/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: false,
        }
      );

      const documentUrl = res.data.secure_url;
      setValues((prev: any) => ({ ...prev, document: documentUrl }));
      setError((prev) => ({ ...prev, document: "" }));

      toast.update(toastId, {
        render: "Document uploaded successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Upload error:", err);
      toast.update(toastId, {
        render: "Upload failed. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nameErr = nameValidation(values.companyName);
    const emailErr = emailValidation(values.email);
    const addressErr = addressValidation(values.address);
    const numberErr = numberValidation(values.number);
    const documentErr = values.document ? "" : "Verification document is required";

    setError({
      companyName: nameErr,
      email: emailErr,
      address: addressErr,
      number: numberErr,
      document: documentErr,
    });

    if (nameErr || emailErr || addressErr || numberErr || documentErr) return;
    if (isUploading) {
      toast.info("Please wait for the document to finish uploading.");
      return;
    }

    try {
      await reVerifyCompanyApi(values);
      toast.success("Company details submitted for verification");
      navigate("/subscription/company/verify/status");
    } catch (err) {
      toast.error("Something went wrong. Try again");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Re-Apply Info Banner */}
        <div className="mb-8 bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-4">
          <div className="bg-amber-100 p-2 h-fit rounded-xl">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-black text-amber-900 text-sm uppercase tracking-tight">Re-Apply for Verification</h3>
            <p className="text-xs text-amber-700 font-medium mt-1 leading-relaxed">
              Your previous request was rejected or expired. Please review and submit updated company details including a valid document.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Update Registration</h1>
          <p className="text-gray-500 font-medium text-sm">Correct your information and re-submit</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              value={values.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-gray-700"
            />
            {error.companyName && <p className="text-left text-red-500 text-[10px] font-bold mt-1 uppercase tracking-tight">{error.companyName}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
              Business Address *
            </label>
            <input
              type="text"
              name="address"
              value={values.address}
              onChange={handleChange}
              placeholder="Street, City, State, ZIP"
              className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-gray-700"
            />
            {error.address && <p className="text-left text-red-500 text-[10px] font-bold mt-1 uppercase tracking-tight">{error.address}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                Contact Email *
              </label>
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                placeholder="email@company.com"
                className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-gray-700"
              />
              {error.email && <p className="text-left text-red-500 text-[10px] font-bold mt-1 uppercase tracking-tight">{error.email}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                Contact Phone *
              </label>
              <input
                type="tel"
                name="number"
                value={values.number}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-gray-700"
              />
              {error.number && <p className="text-left text-red-500 text-[10px] font-bold mt-1 uppercase tracking-tight">{error.number}</p>}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 text-start">
              Verification Document *
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center gap-3
                ${values.document 
                  ? "border-emerald-200 bg-emerald-50/50" 
                  : "border-gray-200 bg-gray-50 hover:bg-white hover:border-blue-300"
                }
              `}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                hidden 
                accept=".pdf,.jpg,.jpeg,.png"
              />
              
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">Uploading...</p>
                </div>
              ) : values.document ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Document Updated</p>
                  <p className="text-[8px] text-emerald-400 font-bold truncate max-w-[200px]">Click to change</p>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                    <FileUp className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-700">Upload New License</p>
                    <p className="text-[8px] text-gray-400 font-bold mt-1 uppercase">PDF, PNG or JPG (Max 5MB)</p>
                  </div>
                </>
              )}
            </div>
            {error.document && <p className="text-left text-red-500 text-[10px] font-bold mt-1 uppercase tracking-tight">{error.document}</p>}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-xl transition-all duration-200 shadow-lg shadow-amber-200 active:scale-[0.98]"
            >
              {isUploading ? "Processing..." : "Re-Submit for Verification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyVerificationReapply;
