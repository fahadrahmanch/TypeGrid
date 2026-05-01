import { useState, useEffect, useRef } from "react";
import { verifyCompanyApi } from "../../../api/user/userService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FileUp, Loader2, CheckCircle } from "lucide-react";
import {
  nameValidation,
  emailValidation,
  addressValidation,
  numberValidation,
} from "../../../validations/companyRequestFormValidations";

import { getCompanyStatusApi } from "../../../api/user/userService";

const CompanyVerificationFormDiv: React.FC = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState<any>();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState({
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

  function handleChange(e: any) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large. Max 5MB allowed.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading document...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "UMS-MERN"); // Using same preset as profile

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dbo7vvi5z/image/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: false,
        }
      );

      const documentUrl = res.data.secure_url;
      setValues((prev) => ({ ...prev, document: documentUrl }));
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

  async function handleSubmit(e: any) {
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
      const response = await verifyCompanyApi({ ...values, planId: id });
      toast.success(response?.data?.message || "Company details submitted!");
      navigate("/subscription/company/verify/status");
    } catch (error: any) {
      toast.error(error.response?.data?.message);
      console.log(error);
    }
  }

  useEffect(() => {
    async function fetchCompanyDetails() {
      try {
        const response = await getCompanyStatusApi();
        setCompany(response.data.company);
      } catch (error) {
        console.log(error);
        setCompany(null);
      }
    }
    fetchCompanyDetails();
  }, []);

  if (company?.status == "active" || company?.status == "expired") {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Company Verification</h1>
          <p className="text-gray-500 font-medium text-sm">Submit your information for verification</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 text-start">
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              onChange={handleChange}
              placeholder="Enter company name"
              className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-gray-700"
            />
            {error.companyName && <p className="text-left text-red-500 text-[10px] font-bold mt-1 uppercase tracking-tight">{error.companyName}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 text-start">
              Business Address *
            </label>
            <input
              type="text"
              name="address"
              onChange={handleChange}
              placeholder="Street, City, State, ZIP"
              className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-gray-700"
            />
            {error.address && <p className="text-left text-red-500 text-[10px] font-bold mt-1 uppercase tracking-tight">{error.address}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 text-start">
                Contact Email *
              </label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="email@company.com"
                className="w-full px-5 py-3.5 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-gray-700"
              />
              {error.email && <p className="text-left text-red-500 text-[10px] font-bold mt-1 uppercase tracking-tight">{error.email}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 text-start">
                Contact Phone *
              </label>
              <input
                type="tel"
                name="number"
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
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Document Uploaded</p>
                  <p className="text-[8px] text-emerald-400 font-bold truncate max-w-[200px]">Click to change</p>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                    <FileUp className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-700">Upload Business License</p>
                    <p className="text-[8px] text-gray-400 font-bold mt-1 uppercase">PDF, PNG or JPG (Max 5MB)</p>
                  </div>
                </>
              )}
            </div>
            {error.document && <p className="text-left text-red-500 text-[10px] font-bold mt-1 uppercase tracking-tight">{error.document}</p>}
          </div>

          <div className="pt-4">
            <button
              type="button"
              disabled={isUploading}
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-200 active:scale-[0.98]"
            >
              Submit for Verification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CompanyVerificationFormDiv;
