import React, { useState } from "react";
import Navbar from "../../components/user/Navbar";
import { toast } from "react-toastify";
import { passwordValidation, confirmPasswordValidation } from "../../validations/authValidations";
import { changePasswordApi } from "../../api/user/userService";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Check, X, ShieldCheck } from "lucide-react";

const ChangePassword: React.FC = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });

        // Real-time validation
        if (name === "newPassword") {
            setErrors(prev => ({ ...prev, newPassword: passwordValidation(value) }));
        }
        if (name === "confirmPassword") {
            setErrors(prev => ({
                ...prev,
                confirmPassword: confirmPasswordValidation(values.newPassword, value)
            }));
        }
        if (name === "currentPassword") {
            setErrors(prev => ({ ...prev, currentPassword: value.trim() ? "" : "Current password is required" }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const currentPassErr = values.currentPassword.trim() ? "" : "Current password is required";
        const newPassErr = passwordValidation(values.newPassword);
        const confirmPassErr = confirmPasswordValidation(values.newPassword, values.confirmPassword);

        setErrors({
            currentPassword: currentPassErr,
            newPassword: newPassErr,
            confirmPassword: confirmPassErr
        });

        if (currentPassErr || newPassErr || confirmPassErr) return;

        setIsLoading(true);
        console.log(values.currentPassword,values.newPassword,values.confirmPassword)
        try {
            const response = await changePasswordApi({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword
            });

            if (response.data) {
                toast.success("Password changed successfully", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                });
                setValues({ currentPassword: "", newPassword: "", confirmPassword: "" });
                // Optional: redirect to home or profile
              
                navigate("/");
            }
        } catch (error: any) {
            console.error("Change password error:", error);
            toast.error(error?.response?.data?.message || "Failed to change password. Please try again.", {
                position: "top-center",
                theme: "colored"
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Password requirements checklist component
    const PasswordRequirements = () => {
        const minLength = values.newPassword.length >= 6;
        const hasValue = values.newPassword.length > 0;

        return (
            <div className={`mt-2 transition-all duration-300 overflow-hidden ${hasValue ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="text-xs space-y-1 pl-1">
                    <div className={`flex items-center ${minLength ? 'text-green-500' : 'text-gray-400'}`}>
                        {minLength ? <Check size={12} className="mr-1" /> : <div className="w-3 h-3 rounded-full border border-gray-300 mr-1"></div>}
                        <span>At least 6 characters</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen transition-colors duration-300">
            <Navbar />
            <div className="container mx-auto px-4 py-8 flex justify-center items-center" style={{ minHeight: "calc(100vh - 80px)" }}>
                <div className="w-full max-w-md transform transition-all hover:scale-[1.01] duration-300">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-[#D4C5B5] dark:border-gray-700">

                        {/* Header */}
                        <div className="px-8 py-8 bg-[#B99F8D] text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm mb-3 shadow-inner ring-1 ring-white/30">
                                    <ShieldCheck className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white tracking-wide font-jaini">
                                    Change Password
                                </h2>
                                <p className="text-[#EFE6E0] text-sm mt-1 font-medium">
                                    Secure your account
                                </p>
                            </div>
                        </div>

                        <div className="p-8 bg-white dark:bg-gray-800">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Current Password */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-[#8C7362] dark:text-gray-300 ml-1">
                                        Current Password
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className={`h-5 w-5 ${errors.currentPassword ? 'text-red-400' : 'text-[#B99F8D] group-focus-within:text-[#9A8170]'} transition-colors duration-200`} />
                                        </div>
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            name="currentPassword"
                                            value={values.currentPassword}
                                            onChange={handleChange}
                                            className={`block w-full pl-10 pr-10 py-3 border rounded-xl leading-5 bg-[#FAF8F6] dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B99F8D] focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 ${errors.currentPassword ? "border-red-500 ring-1 ring-red-500" : "border-[#E0D4C8] dark:border-gray-600 hover:border-[#B99F8D] dark:hover:border-gray-500"
                                                }`}
                                            placeholder="••••••••••••"
                                        />
                                        <div
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-[#8C7362] dark:hover:text-gray-200 transition-colors"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        >
                                            {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </div>
                                    </div>
                                    {errors.currentPassword && (
                                        <div className="flex items-center text-red-500 text-xs mt-1 ml-1 animate-fadeIn">
                                            <X size={12} className="mr-1" />
                                            {errors.currentPassword}
                                        </div>
                                    )}
                                </div>

                                {/* New Password */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-[#8C7362] dark:text-gray-300 ml-1">
                                        New Password
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className={`h-5 w-5 ${errors.newPassword ? 'text-red-400' : 'text-[#B99F8D] group-focus-within:text-[#9A8170]'} transition-colors duration-200`} />
                                        </div>
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            name="newPassword"
                                            value={values.newPassword}
                                            onChange={handleChange}
                                            className={`block w-full pl-10 pr-10 py-3 border rounded-xl leading-5 bg-[#FAF8F6] dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B99F8D] focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 ${errors.newPassword ? "border-red-500 ring-1 ring-red-500" : "border-[#E0D4C8] dark:border-gray-600 hover:border-[#B99F8D] dark:hover:border-gray-500"
                                                }`}
                                            placeholder="At least 6 characters"
                                        />
                                        <div
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-[#8C7362] dark:hover:text-gray-200 transition-colors"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </div>
                                    </div>
                                    <PasswordRequirements />
                                    {errors.newPassword && (
                                        <div className="flex items-center text-red-500 text-xs mt-1 ml-1 animate-fadeIn">
                                            <X size={12} className="mr-1" />
                                            {errors.newPassword}
                                        </div>
                                    )}
                                </div>

                                {/* Confirm New Password */}
                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-[#8C7362] dark:text-gray-300 ml-1">
                                        Confirm New Password
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className={`h-5 w-5 ${errors.confirmPassword ? 'text-red-400' : 'text-[#B99F8D] group-focus-within:text-[#9A8170]'} transition-colors duration-200`} />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={values.confirmPassword}
                                            onChange={handleChange}
                                            className={`block w-full pl-10 pr-10 py-3 border rounded-xl leading-5 bg-[#FAF8F6] dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#B99F8D] focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 ${errors.confirmPassword ? "border-red-500 ring-1 ring-red-500" : "border-[#E0D4C8] dark:border-gray-600 hover:border-[#B99F8D] dark:hover:border-gray-500"
                                                }`}
                                            placeholder="Re-enter new password"
                                        />
                                        <div
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-[#8C7362] dark:hover:text-gray-200 transition-colors"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </div>
                                    </div>
                                    {errors.confirmPassword && (
                                        <div className="flex items-center text-red-500 text-xs mt-1 ml-1 animate-fadeIn">
                                            <X size={12} className="mr-1" />
                                            {errors.confirmPassword}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full relative overflow-hidden group text-white bg-[#B99F8D] hover:bg-[#A38676] focus:ring-4 focus:ring-[#D4C5B5] font-bold rounded-xl text-sm px-5 py-3.5 text-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 ${isLoading ? "opacity-75 cursor-not-allowed" : ""
                                        }`}
                                >
                                    <div className="absolute inset-0 w-full h-full bg-white/20 group-hover:translate-x-full transition-transform duration-500 -translate-x-full skew-x-12"></div>
                                    {isLoading ? (
                                        <span className="flex items-center justify-center relative z-10">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        <span className="relative z-10 flex items-center justify-center">
                                            Change Password
                                        </span>
                                    )}
                                </button>

                                <div className="text-center pt-2">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/')}
                                        className="text-[#8C7362] hover:text-[#6E5A4B] dark:text-gray-400 dark:hover:text-gray-200 text-sm font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="mt-8 text-center text-[#8C7362]/60 dark:text-gray-500 text-xs">
                        <p>© 2026 TypeGrid. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;