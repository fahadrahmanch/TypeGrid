import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDataApi, updateUserDataApi } from "../../../api/user/userService";
import axios from "axios";
import { toast } from "react-toastify";
import {
  nameValidation,
  numberValidation,
  bioValidation,
  ageValidation,
} from "../../../validations/profilevalidations";
import { User, Mail, Phone, Calendar, FileText, Camera, Save, X, Shield, Zap, Lock, ChevronRight } from "lucide-react";

const EditProfileDiv1: React.FC = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState({
    name: "",
    bio: "",
    number: "",
    age: "",
  });

  const [user, setUser] = useState({
    name: "",
    email: "",
    bio: "",
    age: "",
    number: "",
    gender: "",
    imageUrl: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getUserData() {
      const res = await getUserDataApi();
      if (res?.data.user.imageUrl) {
        setUser({
          name: res.data.user.name,
          email: res.data.user.email,
          bio: res.data.user.bio,
          age: res.data.user.age,
          number: res.data.user.number,
          gender: res.data.user.gender || "",
          imageUrl: res.data.user.imageUrl || "",
        });
      }
    }
    getUserData();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const nameErr = nameValidation(user.name);
    const numberErr = numberValidation(user.number);
    const ageErr = ageValidation(user.age);
    const bioErr = bioValidation(user.bio);

    setError({
      name: nameErr,
      number: numberErr,
      age: ageErr,
      bio: bioErr,
    });

    if (nameErr || numberErr || ageErr || bioErr) return;

    setIsLoading(true);
    try {
      const res = await updateUserDataApi(user);
      if (res.data.success) {
        toast.success("Profile updated successfully!", {
          position: "top-center",
          theme: "colored",
        });
      } else {
        toast.error(res.data.message || "Update failed!", {
          position: "top-center",
          theme: "colored",
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong!", {
        position: "top-center",
        theme: "colored",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = async (e: any) => {
    const { name, value } = e.target;
    setUser({ ...user, [e.target.name]: e.target.value });
    if (name === "name") {
      setError({ ...error, name: nameValidation(value) });
    }
    if (name === "number") {
      setError({ ...error, number: numberValidation(value) });
    }
    if (name === "age") {
      setError({ ...error, age: ageValidation(value) });
    }
    if (name === "bio") {
      setError({ ...error, bio: bioValidation(value) });
    }
  };

  const handleImageChange = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    let imageUrl = user?.imageUrl;

    const toastId = toast.loading("Uploading image...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "UMS-MERN");
      const res = await axios.post("https://api.cloudinary.com/v1_1/dbo7vvi5z/image/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: false,
      });
      const data = res.data;
      imageUrl = data.secure_url;
      setUser((prev: any) => ({
        ...prev,
        imageUrl,
      }));
      toast.update(toastId, {
        render: "Image uploaded successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      console.log("fail uploading error", err);
      toast.update(toastId, {
        render: "Image upload failed",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="min-h-screen transition-colors duration-300 py-6 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto pt-16 md:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* LEFT COLUMN: Profile Pic & Status (4 columns) */}
          <div className="lg:col-span-4 space-y-6 md:space-y-8">
            {/* Profile Picture Card */}
            <div className="bg-[#FAF3E6] rounded-2xl p-6 md:p-8 shadow-sm border border-[#F5EBD8] relative overflow-hidden group">
              <h2 className="text-lg md:text-xl font-bold text-[#4A4A4A] mb-6 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Picture
              </h2>

              <div className="flex flex-col items-center">
                <div className="relative mb-6 md:mb-8 group-hover:scale-105 transition-transform duration-300">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#F0E4D4] p-1 shadow-lg overflow-hidden bg-white">
                    <img
                      src={user.imageUrl || "https://via.placeholder.com/150"}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <button
                    onClick={handleClick}
                    className="absolute bottom-1 right-1 md:bottom-2 md:right-2 p-2 md:p-3 bg-[#96705B] hover:bg-[#7D5A46] text-white rounded-full shadow-lg transition-colors duration-200 border-2 border-white"
                    title="Change Photo"
                  >
                    <Camera className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <input name="image" type="file" ref={inputRef} onChange={handleImageChange} hidden accept="image/*" />
                </div>

                <p className="text-[10px] md:text-xs text-center text-gray-400 px-4">
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> Max size of 3.1 MB
                </p>
              </div>
            </div>

            {/* Account Status Card */}
            <div className="bg-[#FAF3E6] rounded-2xl p-6 md:p-8 shadow-sm border border-[#F5EBD8] relative overflow-hidden">
              <h2 className="text-lg md:text-xl font-bold text-[#4A4A4A] mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Account Status
              </h2>

              <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl border border-[#F5EBD8] gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Plan</p>
                    <p className="font-black text-gray-700">Free User</p>
                  </div>
                </div>

                <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-[#96705B] hover:bg-[#7D5A46] text-white rounded-lg shadow-md transition-all text-xs font-black uppercase tracking-widest active:scale-95">
                  <Zap className="w-3.5 h-3.5" />
                  Upgrade
                </button>
              </div>
            </div>

            {/* Change Password Card */}
            <div className="bg-[#FAF3E6] rounded-2xl p-5 md:p-6 shadow-sm border border-[#F5EBD8] relative overflow-hidden group hover:shadow-md transition-all duration-300">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => navigate("/change/password")}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl group-hover:bg-[#96705B]/10 transition-colors">
                    <Lock className="w-5 h-5 md:w-6 md:h-6 text-[#96705B]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#4A4A4A] text-base md:text-lg leading-tight">Password</h3>
                    <p className="text-xs text-gray-400 font-medium">Update your security</p>
                  </div>
                </div>
                <div className="p-2 bg-white rounded-full group-hover:translate-x-1 transition-transform">
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-[#96705B]" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Basic Information (8 columns) */}
          <div className="lg:col-span-8">
            <div className="bg-[#FAF3E6] rounded-2xl p-6 md:p-8 shadow-sm border border-[#F5EBD8] relative overflow-hidden h-full">
              <h2 className="text-lg md:text-xl font-bold text-[#4A4A4A] mb-8 flex items-center border-b border-[#F5EBD8] pb-4">
                <FileText className="w-5 h-5 mr-2" />
                Basic Information
              </h2>

              <div className="space-y-6 md:space-y-8">
                {/* Row 1: Name & Number */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#888] uppercase tracking-widest flex items-center">
                      <User className="w-3.5 h-3.5 mr-2" /> Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      onChange={handleChange}
                      value={user.name}
                      className={`w-full bg-[#FFFBF2] border-2 border-transparent rounded-xl px-4 py-3 text-gray-700 font-bold focus:border-[#96705B] outline-none transition-all ${error.name ? "border-red-400" : ""}`}
                      placeholder="Enter your name"
                    />
                    {error.name && <p className="text-red-500 text-[10px] font-bold mt-1">{error.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#888] uppercase tracking-widest flex items-center">
                      <Phone className="w-3.5 h-3.5 mr-2" /> Phone Number
                    </label>
                    <input
                      type="number"
                      name="number"
                      onChange={handleChange}
                      value={user.number}
                      className={`w-full bg-[#FFFBF2] border-2 border-transparent rounded-xl px-4 py-3 text-gray-700 font-bold focus:border-[#96705B] outline-none transition-all ${error.number ? "border-red-400" : ""}`}
                      placeholder="Enter your number"
                    />
                    {error.number && <p className="text-red-500 text-[10px] font-bold mt-1">{error.number}</p>}
                  </div>
                </div>

                {/* Email (Read only) */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#888] uppercase tracking-widest flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-2" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full bg-white/50 border-2 border-dashed border-[#F5EBD8] rounded-xl px-4 py-3 text-gray-400 font-bold outline-none cursor-not-allowed"
                  />
                </div>

                {/* Row 2: Bio */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-[#888] uppercase tracking-widest flex items-center">
                    <FileText className="w-3.5 h-3.5 mr-2" /> Bio
                  </label>
                  <textarea
                    rows={4}
                    name="bio"
                    value={user.bio || ""}
                    onChange={handleChange}
                    className={`w-full bg-[#FFFBF2] border-2 border-transparent rounded-xl px-4 py-3 text-gray-700 font-medium focus:border-[#96705B] outline-none resize-none transition-all ${error.bio ? "border-red-400" : ""}`}
                    placeholder="Tell us a little about yourself..."
                  ></textarea>
                  {error.bio && <p className="text-red-500 text-[10px] font-bold mt-1">{error.bio}</p>}
                </div>

                {/* Row 3: Age & Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#888] uppercase tracking-widest flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-2" /> Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      onChange={handleChange}
                      value={user.age}
                      className={`w-full bg-[#FFFBF2] border-2 border-transparent rounded-xl px-4 py-3 text-gray-700 font-bold focus:border-[#96705B] outline-none transition-all ${error.age ? "border-red-400" : ""}`}
                      placeholder="Your age"
                    />
                    {error.age && <p className="text-red-500 text-[10px] font-bold mt-1">{error.age}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-[#888] uppercase tracking-widest flex items-center">
                      <User className="w-3.5 h-3.5 mr-2" /> Gender
                    </label>
                    <div className="relative">
                      <select
                        name="gender"
                        className="w-full bg-[#FFFBF2] border-2 border-transparent rounded-xl px-4 py-3 text-gray-700 font-bold focus:border-[#96705B] outline-none appearance-none transition-all cursor-pointer"
                        value={user.gender}
                        onChange={handleChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                        <ChevronRight className="w-4 h-4 rotate-90" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-end gap-3 md:gap-4 border-t border-[#F5EBD8] pt-8">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="px-8 py-3 bg-[#E5DCD0] text-[#4A4A4A] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#D6C8B8] transition-all w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`px-8 py-3 bg-[#96705B] hover:bg-[#7D5A46] text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#96705B]/20 transition-all active:scale-95 w-full sm:w-auto flex items-center justify-center gap-2 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileDiv1;
