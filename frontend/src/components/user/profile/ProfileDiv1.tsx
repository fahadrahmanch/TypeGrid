import { Link } from "react-router-dom";
const ProfileDiv1: React.FC = () => {
  return (
    <>
      <div className="w-full mt-16 max-w-6xl bg-[#FAF3E6] rounded-2xl p-8 flex flex-col md:flex-row items-start justify-between gap-6 shadow-sm  border border-[#F5EBD8] ">
        {/* Left Side: Avatar & Info */}
        <div className="flex flex-col md:flex-row gap-6 w-full">
          {/* Avatar Placeholder */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full border-4 border-[#F0E4D4] bg-[#FFEFE5]"></div>
          </div>
          {/* User Details */}
          <div className="flex flex-col">
            {/* Name & Badge Row */}
            <div className="flex  gap-3 mb-1 ">
              <h1 className="text-3xl font-bold text-[#2D2D2D]">
                Alex Johnson
              </h1>
              {/* "Free" Badge */}
              <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-gray-200 shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3 h-3 text-gray-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs font-medium text-gray-600">Free</span>
              </div>
            </div>
            {/* Level */}
            <p className="text-[#8C6B5D] font-bold text-sm mb-1 flex">
              Level 12
            </p>
            {/* Email */}
            <p className="text-gray-500 text-base mb-3 flex">
              alex.johnson@email.com
            </p>
            {/* Bio Description */}
            <p className="text-gray-600 leading-relaxed max-w-2xl flex">
              Passionate typist working to improve speed and accuracy.
            </p>
          </div>
        </div>
        {/* Right Side: Action Buttons */}
        <div className="flex flex-col gap-3 w-full md:w-auto flex-shrink-0 mt-4 md:mt-0">
          {/* Edit Profile Button */}
          <Link to="/profile/edit">
            <button className="flex items-center justify-center gap-2 px-6 py-2.5 border border-[#D1C4B6] rounded-lg text-[#4A4A4A] font-semibold hover:bg-[#EDE4D6] transition">
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
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
              Edit Profile
            </button>
          </Link>
          {/* Upgrade Premium Button */}
          <Link to="/subscription/company">
            <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#96705B] rounded-lg text-white font-semibold hover:bg-[#7D5A46] shadow-sm transition">
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
                  d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.545c.982.143 1.954.317 2.916.52-1.36 3.97-4.79 6.915-8.919 7.25m0 0a6.726 6.726 0 01-2.749-1.35"
                />
              </svg>
              Upgrade to Premium
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};
export default ProfileDiv1;
