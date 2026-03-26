import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, User, Mail, Lock, ShieldCheck, AlertCircle, Plus } from "lucide-react";
import {
  nameValidation,
  emailValidation,
  passwordValidation,
} from "../../../validations/authValidations";
import { toast } from "react-toastify";
import { companyAddUser } from "../../../api/companyAdmin/companyAdminService";

interface AddUserProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUsers: any;
}

const AddUser: React.FC<AddUserProps> = ({ setOpen, setUsers }) => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "TypeGrid123@@@",
  });
  const [error, setError] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = async (e: any) => {
    const { name, value } = e.target;
    setValues({ ...values, [e.target.name]: e.target.value });
    if (name === "name") {
      setError({ ...error, name: nameValidation(value) });
    }
    if (name === "email") {
      setError({ ...error, email: emailValidation(value) });
    }
    if (name === "password") {
      setError({ ...error, password: passwordValidation(value) });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const nameErr = nameValidation(values.name);
    const emailErr = emailValidation(values.email);
    const passErr = passwordValidation(values.password);

    setError({
      name: nameErr,
      email: emailErr,
      password: passErr,
    });

    if (emailErr || passErr) return;

    setIsSubmitting(true);
    try {
      const response = await companyAddUser({
        name: values.name,
        email: values.email,
        password: values.password,
        role: "companyUser",
      });
      setUsers((prev: any[]) => [...prev, response.data.data]);
      setOpen(false);
      toast.success(response.data.message);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300"
        onClick={() => setOpen(false)}
      />
      
      {/* Modal Container */}
      <div className="bg-[#FFF8EA] rounded-[2.5rem] shadow-2xl w-full max-w-2xl relative overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
        
        {/* Decorative Header Area */}
        <div className="bg-gradient-to-r from-[#ECA468] to-[#D0864B] p-10 relative overflow-hidden text-start">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">Engage New Talent</h2>
            <p className="text-white/80 font-medium tracking-tight">Create a new student profile and get them started on their journey.</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="absolute top-8 right-8 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-white group"
          >
            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Full Name */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <User size={12} className="text-[#D0864B]" />
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    placeholder="e.g. Alexander Pierce"
                    className={`w-full px-6 py-4 bg-white border ${error.name ? "border-rose-300" : "border-[#ECA468]/20"} rounded-2xl outline-none focus:ring-4 focus:ring-[#ECA468]/10 transition-all font-bold text-gray-700 shadow-sm`}
                  />
                  {error.name && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500">
                      <AlertCircle size={18} />
                    </div>
                  )}
                </div>
                {error.name && <p className="text-xs font-bold text-rose-500 ml-1">{error.name}</p>}
              </div>

              {/* Email Address */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Mail size={12} className="text-[#D0864B]" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="student@university.edu"
                    className={`w-full px-6 py-4 bg-white border ${error.email ? "border-rose-300" : "border-[#ECA468]/20"} rounded-2xl outline-none focus:ring-4 focus:ring-[#ECA468]/10 transition-all font-bold text-gray-700 shadow-sm`}
                  />
                  {error.email && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-500">
                      <AlertCircle size={18} />
                    </div>
                  )}
                </div>
                {error.email && <p className="text-xs font-bold text-rose-500 ml-1">{error.email}</p>}
              </div>
            </div>

            {/* Password Section */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Lock size={12} className="text-[#D0864B]" />
                Access Password
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  className={`w-full px-6 py-4 bg-white border ${error.password ? "border-rose-300" : "border-[#ECA468]/20"} rounded-2xl outline-none focus:ring-4 focus:ring-[#ECA468]/10 transition-all font-bold text-gray-700 shadow-sm`}
                />
                <ShieldCheck size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
              </div>
              <p className="text-[10px] text-gray-400 font-medium ml-1 flex items-center gap-1.5 leading-relaxed">
                <AlertCircle size={10} />
                New members will use this password for their initial login.
              </p>
              {error.password && <p className="text-xs font-bold text-rose-500 ml-1">{error.password}</p>}
            </div>

            {/* Hint Box */}
            <div className="bg-[#FFF8EA] border border-[#ECA468]/20 rounded-[1.5rem] p-6 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#ECA468]/10 flex items-center justify-center text-[#D0864B] shrink-0">
                <ShieldCheck size={20} />
              </div>
              <p className="text-xs font-medium text-gray-500 leading-relaxed text-start">
                Accounts are initialized with <span className="font-bold text-[#D0864B] uppercase tracking-widest">Active</span> status.
                Students can immediately access assigned materials upon successful login.
              </p>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-10 border-t border-gray-50/50 flex justify-between items-center bg-[#FFF8EA]/50">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-8 py-4 text-gray-400 hover:text-gray-600 font-black uppercase tracking-widest text-[10px] transition-all"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-10 py-5 bg-[#D0864B] hover:bg-[#B36E39] text-white rounded-2xl font-black shadow-lg shadow-[#D0864B]/20 transition-all uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Plus size={18} className="group-hover:scale-110 transition-transform" />
            )}
            Create Profile
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
export default AddUser;
