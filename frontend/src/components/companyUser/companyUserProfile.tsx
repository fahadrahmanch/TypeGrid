import React, { useEffect, useState } from "react";
import CompanyUserNavbar from "./layout/companyUserNavbar";
import { fetchCompanyUserProfile } from "../../api/companyUser/companyProfile";
import { useSelector } from "react-redux";
import {
  User,
  Mail,
  Building2,
  Trophy,
  Target,
  Zap,
  Calendar,
  Edit2,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Camera,
} from "lucide-react";
import { toast } from "react-toastify";
import { updateProfilePicture, updateCompanyPassword } from "../../api/companyUser/companyProfile";
import { useRef } from "react";
import {
  oldPasswordValidation,
  newPasswordValidation,
  confirmPasswordValidation,
} from "../../validations/profilevalidations";

interface ProfileData {
  identity: {
    fullName: string;
    email: string;
    role: string;
    company: string;
    memberSince: string;
    imageUrl: string;
  };
  stats: {
    avgSpeed: number;
    accuracy: number;
    lessons: number;
  };
  tier: string;
}

export const CompanyUserProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState<{
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = useSelector((state: any) => state.auth.user);

  const fetchProfile = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const res = await fetchCompanyUserProfile(user._id);
      setProfile(res.data.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user?._id]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?._id) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      toast.info("Uploading image...");
      await updateProfilePicture(user._id, formData);
      toast.success("Profile picture updated successfully!");
      fetchProfile();
    } catch (error: any) {
      console.error("Error uploading image:", error);
      toast.error(error.response?.data?.message || "Failed to update profile picture");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Inline validation using utility functions
    const errors: typeof formErrors = {};
    const oldPassError = oldPasswordValidation(passwordData.oldPassword);
    const newPassError = newPasswordValidation(passwordData.newPassword);
    const confirmPassError = confirmPasswordValidation(passwordData.newPassword, passwordData.confirmPassword);

    if (oldPassError) errors.oldPassword = oldPassError;
    if (newPassError) errors.newPassword = newPassError;
    if (confirmPassError) errors.confirmPassword = confirmPassError;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await updateCompanyPassword(
        {
          currentPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        },
        user._id
      );
      toast.success("Password changed successfully!");
      setShowPasswordForm(false);
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setFormErrors({});
    } catch (error: any) {
      console.error("Error changing password:", error);
      const message = error.response?.data?.message || "Password update failed";
      if (message.toLowerCase().includes("current password")) {
        setFormErrors({ oldPassword: "Incorrect current password" });
      } else {
        toast.error(message);
      }
    }
  };

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
  }: {
    icon: any;
    label: string;
    value: string | number;
    color: string;
  }) => (
    <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-[#FDE6C6] hover:shadow-lg transition-all duration-300 group">
      <div className={`p-3 rounded-2xl ${color} w-fit mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-[#FFF8EA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B7355]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8EA] pb-12">
      <CompanyUserNavbar />

      <div className="pt-24 px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Banner Section */}
        <div className="relative bg-gradient-to-r from-[#8B7355] to-[#A68F6F] h-48 sm:h-64 rounded-[2rem] overflow-hidden shadow-2xl mb-[-4rem] sm:mb-[-5rem]">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.2),transparent)]"></div>
          </div>
          <div className="absolute bottom-6 right-8 flex gap-4 hidden sm:flex">
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-white text-sm font-medium flex items-center gap-2 border border-white/10">
              <Trophy className="w-4 h-4 text-yellow-300" />
              {profile.tier} Tier
            </div>
          </div>
        </div>

        {/* Profile Info Header */}
        <div className="px-4 sm:px-12 flex flex-col sm:flex-row items-end gap-6 mb-12 relative z-10">
          <div className="relative group">
            <img
              src={profile.identity.imageUrl ?? "https://api.dicebear.com/7.x/avataaars/svg?seed=Fahad"}
              alt={profile.identity.fullName}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] bg-white p-2 shadow-xl border-4 border-white object-cover"
            />
            <button
              onClick={handleImageClick}
              className="absolute bottom-2 right-2 p-2 bg-white rounded-xl shadow-lg border border-gray-100 text-[#8B7355] hover:scale-110 transition-transform cursor-pointer group/cam"
              title="Change Profile Picture"
            >
              <Camera className="w-4 h-4 group-hover/cam:scale-110 transition-transform" />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
          </div>
          <div className="flex-1 pb-2 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {profile.identity.fullName}
              </h1>
              <span className="px-3 py-1 bg-[#8B7355]/10 text-[#8B7355] rounded-full text-xs font-bold uppercase tracking-wider w-fit mx-auto sm:mx-0">
                {profile.identity.role}
              </span>
            </div>
            <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-2 font-medium">
              <Building2 className="w-4 h-4" />
              {profile.identity.company}
            </p>
          </div>
          <div className="pb-2 hidden sm:block">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-2.5 bg-white text-[#8B7355] border border-[#FDE6C6] rounded-2xl font-bold shadow-sm hover:shadow-md hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              {isEditing ? "Save Profile" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12">
          <StatCard
            icon={Zap}
            label="Avg. Speed"
            value={`${profile.stats.avgSpeed} WPM`}
            color="bg-orange-100 text-orange-600"
          />
          <StatCard
            icon={Target}
            label="Accuracy"
            value={`${profile.stats.accuracy}%`}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard icon={Trophy} label="Lessons" value={profile.stats.lessons} color="bg-purple-100 text-purple-600" />
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-[#FDE6C6] shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <User className="text-[#8B7355]" />
                Identity Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 capitalize px-1 tracking-widest">Full Name</label>
                  <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl">
                    <User className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={profile.identity.fullName}
                      readOnly={!isEditing}
                      className="bg-transparent outline-none w-full font-semibold text-gray-700 disabled:text-gray-500"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 capitalize px-1 tracking-widest">Email</label>
                  <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={profile.identity.email}
                      readOnly={!isEditing}
                      className="bg-transparent outline-none w-full font-semibold text-gray-700 disabled:text-gray-500"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 capitalize px-1 tracking-widest">Role Type</label>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                    <ShieldCheck className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={profile.identity.role}
                      readOnly
                      className="bg-transparent outline-none w-full font-semibold text-gray-400"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 capitalize px-1 tracking-widest">
                    Member Since
                  </label>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={profile.identity.memberSince}
                      readOnly
                      className="bg-transparent outline-none w-full font-semibold text-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#8B7355]/5 border border-[#8B7355]/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6">
              <div className="bg-[#8B7355] p-6 rounded-3xl text-white shadow-xl shadow-[#8B7355]/20">
                <Lock className="w-12 h-12" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-800">Security Settings</h3>
                <p className="text-gray-600 font-medium">
                  Keep your account secure by regularly updating your password.
                </p>
              </div>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className={`px-6 py-3 rounded-2xl font-bold transition-all shadow-lg hover:scale-105 active:scale-95 ${
                  showPasswordForm
                    ? "bg-white text-gray-600 border border-gray-200"
                    : "bg-[#8B7355] text-white shadow-[#8B7355]/30 hover:bg-[#725e46]"
                }`}
              >
                {showPasswordForm ? "Cancel" : "Change Password"}
              </button>
            </div>

            {showPasswordForm && (
              <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-[#FDE6C6] shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Lock className="text-[#8B7355]" />
                  Change Password
                </h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-gray-400 capitalize px-1 tracking-widest">
                        Current Password
                      </label>
                      <div className="relative group">
                        <input
                          type={showOldPassword ? "text" : "password"}
                          name="oldPassword"
                          value={passwordData.oldPassword}
                          onChange={handlePasswordChange}
                          className={`w-full pl-4 pr-12 py-4 bg-white border rounded-2xl outline-none focus:border-[#8B7355] transition-colors font-semibold ${
                            formErrors.oldPassword ? "border-red-400" : "border-gray-100"
                          }`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B7355] transition-colors"
                        >
                          {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {formErrors.oldPassword && (
                        <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{formErrors.oldPassword}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 capitalize px-1 tracking-widest">
                        New Password
                      </label>
                      <div className="relative group">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className={`w-full pl-4 pr-12 py-4 bg-white border rounded-2xl outline-none focus:border-[#8B7355] transition-colors font-semibold ${
                            formErrors.newPassword ? "border-red-400" : "border-gray-100"
                          }`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B7355] transition-colors"
                        >
                          {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {formErrors.newPassword && (
                        <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{formErrors.newPassword}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 capitalize px-1 tracking-widest">
                        Confirm New Password
                      </label>
                      <div className="relative group">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className={`w-full pl-4 pr-12 py-4 bg-white border rounded-2xl outline-none focus:border-[#8B7355] transition-colors font-semibold ${
                            formErrors.confirmPassword ? "border-red-400" : "border-gray-100"
                          }`}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#8B7355] transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {formErrors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{formErrors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-[#8B7355] text-white rounded-2xl font-bold shadow-lg shadow-[#8B7355]/30 hover:bg-[#725e46] transition-all"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-500"></div>
              <h3 className="text-xl font-bold mb-2">Practice More</h3>
              <p className="text-indigo-100 text-sm mb-6 opacity-90">
                Improve your typing speed and accuracy with customized lessons.
              </p>
              <button className="px-6 py-2.5 bg-white text-indigo-600 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                Go to Lessons
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyUserProfile;
