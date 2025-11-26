import { verify } from "crypto";

export const Routes={
    AUTH:{
        //user 
        
        SIGNUP:"/signup",
        VERIFY_OTP: "/verify-otp",
        RESENT_OTP:"/resent-otp",
        SIGNIN:"/signin",
        REFRESH_TOKEN:"/refresh-token",
        GOOGLE_AUTH:"/google-login",
        LOGOUT:'/logout',
        FORGOT_PASSWORD:'/forgot/password',
        FORGOT_PASSWORD_OTP_VERIFY:'/forgot/password/verify/otp',
        CREATE_NEW_PASSWORD:'/create/new/password',

        //admin
        ADMIN_SIGNIN:'/admin/signin'
    },

    ADMIN:{
        GET_USERS:'/users'
    },

    USERS:{
        verifyCompany:'/subscription/company/verify'
    }
};