export const Routes = {
  AUTH: {
    //user

    SIGNUP: "/signup",
    VERIFY_OTP: "/verify-otp",
    RESENT_OTP: "/resent-otp",
    SIGNIN: "/signin",
    REFRESH_TOKEN: "/refresh-token",
    GOOGLE_AUTH: "/google-login",
    LOGOUT: "/logout",
    FORGOT_PASSWORD: "/forgot/password",
    FORGOT_PASSWORD_OTP_VERIFY: "/forgot/password/verify/otp",
    CREATE_NEW_PASSWORD: "/create/new/password",

    //admin
    ADMIN_SIGNIN: "/signin",
  },

  ADMIN: {
    //get
    GET_USERS: "/users",
    GET_COMPANYS:'/company',

    //post
    APPROVE_COMPANY:'/approve/company',
    REJECT_COMPANY:"/reject/company"
  },

  USERS: {
    // GET 
    getUserData:'/data',
   
    //Edit
    updateUser:'/update',
  
    verifyCompany: "/subscription/company/verify",

    //get company status
    GETCOMPANYSTATUS:'/subscription/company/status'
  

  },


};
