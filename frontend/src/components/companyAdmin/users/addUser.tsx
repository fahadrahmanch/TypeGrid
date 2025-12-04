
import {nameValidation,emailValidation,passwordValidation,} from "../../../validations/authValidations";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { companyAddUser } from "../../../api/companyAdmin/companyAdminService";
interface AddUserProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddUser:React.FC<AddUserProps>=({setOpen})=>{
      const [values, setValues] = useState({ name:"",email: "", password: "TypeGrid123@@@" });
      const [error, setError] = useState({name:"", email: "", password: "" });
      const navigate = useNavigate();
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
            const nameErr= nameValidation(values.name)
            const emailErr = emailValidation(values.email);
            const passErr = passwordValidation(values.password);
        
            setError({
              name:nameErr,
              email: emailErr,
              password: passErr,
            });
        
            if (emailErr || passErr) return;
        
            try {
              const response = await companyAddUser({
                name:values.name,
                email: values.email,
                password: values.password,
                role: "companyUser",
              });
        
            //   const accessToken = response?.data?.accessToken;
            //   const user = response?.data?.UserDeepCopy;
            //   if (!accessToken || !user) {
            //     throw new Error("Something went wrong. Please try again");
            //   }
            //   dispatch(setuserAccessToken({ user, accessToken }));
            //   navigate("/");
              toast.success(response.data.message);
            } catch (error: any) {
              const msg =
                error?.response?.data?.message ||
                "Something went wrong. Please try again.";
              toast.error(msg);
            }
          };
        

    return (
      <>
        // Modal Overlay - covers the screen
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          {/* Modal Container */}
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[440px] p-6 relative">
            {/* --- Header --- */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Add New User</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* --- User Slot Information Banner --- */}
            {/* <div className="bg-blue-50 p-4 rounded-lg text-sm text-gray-700 mb-6 text-center font-medium">
          <span className="font-bold text-blue-800">2</span> user slot s remaining in your <span className="font-bold text-blue-800">Standard</span> plan
        </div> */}

            {/* --- Form Fields --- */}
            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-left text-red-500 text-sm">{error.name}</p>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="john.doe@company.com"
                  className="w-full p-3 border border-gray-300 rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-left text-red-500 text-sm">{error.email}</p>
              </div>
              {/* password  */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-start">
                  Password
                </label>
                <input
                  type="text"
                  name="password"
                  defaultValue={"TypeGrid123@@@"}
                  onChange={handleChange}
                  placeholder="TypeGrid123@@@"
                  className="w-full p-3 border border-gray-300 rounded-lg placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-left text-red-500 text-sm">
                  {error.password}
                </p>
              </div>
            </div>

            {/* --- Footer Buttons --- */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => setOpen(false)}
                className="px-6 py-3 text-gray-600 font-semibold hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      </>
    );
}
export default AddUser