import { useEffect } from "react";

const EditProfileDiv1: React.FC = () => {

  useEffect(()=>{
    
  })
 

  return (
    <>
      <div className="min-h-screen  p-4 md:p-8 pt-24 flex flex-col items-center mt-12">
        <div className="w-full max-w-5xl">
          <h1 className="text-3xl font-bold text-[#2D2D2D] mb-8 text-left">
            Edit Profile
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN: Profile Pic & Status */}
            <div className="flex flex-col gap-6 ">
              {/* Profile Picture Card */}
              <div className="bg-[#FAF3E6] rounded-2xl p-8 flex flex-col items-center justify-center shadow-sm border border-[#F5EBD8]">
                <h2 className="text-lg font-bold text-[#4A4A4A] w-full text-left mb-6">
                  Profile Picture
                </h2>

                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full border-4 border-[#F0E4D4] bg-[#FFEFE5]"></div>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 border border-[#D1C4B6] rounded-lg text-[#6B6B6B] font-medium hover:bg-[#EDE4D6] transition bg-transparent">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                    />
                  </svg>
                  Change Photo
                </button>
              </div>

              {/* Account Status Card */}
              <div className="bg-[#FAF3E6] rounded-2xl p-8 shadow-sm border border-[#F5EBD8]">
                <h2 className="text-lg font-bold text-[#4A4A4A] mb-6">
                  Account Status
                </h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 text-gray-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-600">
                      Free
                    </span>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#96705B] rounded-lg text-white text-sm font-semibold hover:bg-[#7D5A46] transition">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.545c.982.143 1.954.317 2.916.52-1.36 3.97-4.79 6.915-8.919 7.25m0 0a6.726 6.726 0 01-2.749-1.35"
                      />
                    </svg>
                    Upgrade
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Basic Information */}
            <div className="lg:col-span-2 bg-[#FAF3E6] rounded-2xl p-8 shadow-sm border border-[#F5EBD8]">
              <h2 className="text-lg font-bold text-[#4A4A4A] mb-6 text-start">
                Basic Information
              </h2>

              <div className="space-y-5">
                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2 text-start">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Alex Johnson"
                      className="w-full bg-[#FFFBF2] border-none rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#96705B] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2 text-start">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue="alex.johnson@email.com"
                      className="w-full bg-[#FFFBF2] border-none rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#96705B] outline-none"
                    />
                  </div>
                </div>

                {/* Row 2: Bio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2 text-start">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="Passionate typist working to improve speed and accuracy. Love competing in typing challenges!"
                    className="w-full bg-[#FFFBF2] border-none rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#96705B] outline-none resize-none"
                  ></textarea>
                </div>

                {/* Row 3: Age & Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2 text-start">
                      Age
                    </label>
                    <input
                      type="number"
                      defaultValue="18"
                      className="w-full bg-[#FFFBF2] border-none rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#96705B] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2 text-start">
                      Gender
                    </label>
                    <select className="w-full bg-[#FFFBF2] border-none rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#96705B] outline-none appearance-none">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                {/* Change Password Button */}
                <div className="pt-2 flex justify-end">
                  <button className="w-full md:w-auto px-6 py-3 bg-[#FFFBF2] border border-transparent hover:border-[#D1C4B6] rounded-lg text-gray-700 font-medium transition">
                    Change password
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM ACTION BUTTONS */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-12 pb-10">
            <button className="flex items-center gap-2 px-8 py-3 bg-[#96705B] rounded-lg text-white font-semibold hover:bg-[#7D5A46] shadow-md transition w-full md:w-auto justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
              Save Changes
            </button>
            <button className="px-8 py-3 bg-[#E5DCD0] border border-transparent rounded-lg text-gray-700 font-semibold hover:bg-[#D6C8B8] transition w-full md:w-auto">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default EditProfileDiv1;
