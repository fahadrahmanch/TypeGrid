import { useState } from "react";
import API from "../../../api/axios/axios";
import kidImage from "../../../assets/images/auth/login/kid.png";
import lines from "../../../assets/images/auth/login/lines.png";

const Register:React.FC=()=>{
    const [values,setValues]=useState({name:'',email:'',password:'',confirmPassword:''})

    const handleSubmit=async(e:any)=>{
      e.preventDefault()
      await API.post("/signup",{
        name:values.name,
        email:values.email,
        password:values.password
      },{
        headers:{
          "Content-Type":"application/json",
        }
      })
    }
    const handleChange=async(e:any)=>{
      setValues({...values,[e.target.name]:e.target.value})
    }
    return(
    <>
    
      {/* Container */}
      <div className="h-screen flex justify-center items-center flex-1 w-full relative  sm:w-4/4 md:w-full lg:w-full  ">
         <div className="w-36 mt-[2rem] hidden sm:block">
          <img
            src={lines}          
            alt="draw"
            className="w-64 mb-10  " 
          />
        </div>
        {/* Signup Box */}
        <div className="bg-[#FFF5E0] p-10 rounded-xl  w-80 z-10 ">
          <h2 className="flex text-2xl font-semibold text-gray-800 mb-5 text-center">Sign up</h2>

          {/* Google Button */}
          <button className="flex items-center justify-center gap-2 w-full bg-[#FFF8EA] drop-shadow-sm  rounded-md py-2 mb-4 hover:bg-gray-100 transition">
            <img
              src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
              alt="Google icon"
              className="w-5 h-5"
            />
            <span className="text-gray-700 text-sm font-medium">Sign up with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="px-2 text-gray-500 text-sm">Or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Form */}
          <form className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
              className="rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#FFF8EA]"
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              className=" rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#FFF8EA]"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              className="rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#FFF8EA]"
            />
            <input
              type="password"
              placeholder="Confirm password"
              name="confirmPassword"
              onChange={handleChange}
              className="rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-[#FFF8EA]"
            />
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-gray-900 text-white rounded-md py-2 mt-2 hover:bg-gray-800 transition"
            >
              Sign up
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-4">
            Already have an account?{" "}
            <a href="#" className="text-gray-900 font-medium hover:underline">
              Log in
            </a>
          </p>
        </div>

        {/* Illustration */}
        <div className="w-36 mt-[2rem] hidden sm:block">
          <img
            src={kidImage}          
            alt="kid"
            className="w-64"
          />
        </div>
         
      </div>
   
    </>
    )
}
export default Register