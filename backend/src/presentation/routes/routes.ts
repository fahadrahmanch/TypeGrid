
export const Routes = {
  // AUTH: {
  //   //user

  //   SIGNUP: "/signup",
  //   VERIFY_OTP: "/verify-otp",
  //   RESENT_OTP: "/resent-otp",
  //   SIGNIN: "/signin",
  //   REFRESH_TOKEN: "/refresh-token",
  //   GOOGLE_AUTH: "/google-login",
  //   LOGOUT: "/logout",
  //   FORGOT_PASSWORD: "/forgot/password",
  //   FORGOT_PASSWORD_OTP_VERIFY: "/forgot/password/verify/otp",
  //   CREATE_NEW_PASSWORD: "/create/new/password",

  //   //admin
  //   ADMIN_SIGNIN: "/signin",

  // },
  AUTH: {
  // user & admin authentication (mounted under /admin or /user separately)

  SIGNUP: "/signup",
  SIGNIN: "/signin",
  LOGOUT: "/logout",
  REFRESH_TOKEN: "/refresh-token",

  // OTP
  VERIFY_OTP: "/otp/verify",
  RESEND_OTP: "/otp/resend",

  // Social login
  GOOGLE_AUTH: "/google",

  // Password recovery
  FORGOT_PASSWORD: "/password/forgot",
  VERIFY_FORGOT_PASSWORD_OTP: "/password/otp/verify",
  RESET_PASSWORD: "/password/reset",
},

  ADMIN: {
    //get
    GET_USERS: "/users",
    GET_COMPANYS:"/companies",

    //post
    // APPROVE_COMPANY:"/approve/company",
    // REJECT_COMPANY:"/reject/company",

    UPDATE_COMPANY_STATUS: "/companies/:companyId/status", 

    CREATE_LESSON:"/lessons",
    FETCH_LESSONS:"/lessons",
    FETCH_LESSON:"/lesson/:id",
    UPDATE_LESSON:"/lesson/:id",
    DELETE_LESSON:"/lesson/:id",
    //patch
    UPDATE_USER_STATUS: "/users/:userId/status",
    

  },

  USERS: {
    // profile
    GET_PROFILE: "/me",
    UPDATE_PROFILE: "/me",
    CHANGE_PASSWORD:"/password",
    // company subscription
    VERIFY_COMPANY: "/company/verification",
    RE_VERIFY_COMPANY: "/company/verification/retry",
    GET_COMPANY_STATUS: "/company/status",

    // typing practice
    START_TYPING_PRACTICE: "/typing/practice",
    GET_LESSON_BY_ID: "/typing/practice/:lessonId",
    


    // group
  GROUP_PLAY: {
  CREATE_GROUP: "/group-play/groups",
  GET_GROUP: "/group-play/groups/:joinLink",
  EDIT_GROUP: "/group-play/groups/:groupId",
  JOIN_GROUP: "/group-play/groups/join/:joinLink",
  REMOVE_MEMBER: "/group-play/groups/:groupId/players/:playerId",
  NEW_GAME:"/group-play/:gameId/new-game",
  //play
  START_GAME: "/group-play/groups/:groupId/start",
  
},
SOLO_PLAY:{
SOLO_CREATE:"/solo-play",
RESULT_SOLO_PLAY:"/solo-result:gameId"

},
QUICK_PLAY:{
START_QUICK_PLAY:"/quick-play/start",
CHANGE_STATUS:"/quick-play/start/:competitionId",
}

  },

    COMPANY_ADMIN: {
    ADD_USER: "/users",
    GET_COMPANY_USERS: "/users",
    DELETE_COMPANY_USER: "/users/:userId",


   //lesson
   CREATE_LESSON:"/lesson",
   FETCH_LESSONS:"/lessons",
   FETCH_LESSON:"/lesson/:id",
   UPDATE_LESSON:"/lesson/:id",
   DELETE_LESSON:"/lesson/:id",
   FETCH_LESSON_BY_ID:"/lesson/:id",
   GET_ADMIN_LESSONS:"/admin-lessons",
   ASSIGN_LESSON:"/lesson-assignments",



   //companyGroup
   CREATE_COMPANY_GROUP:"/company-groups",
   GET_COMPANY_GROUPS:"/company-groups"

  },

  COMPANY_USER:{
    MY_LESSONS:"/my-lessons",
    ASSIGNED_LESSON_BY_ID: "/my-lessons/:assignmentId",
    SAVE_LESSON_RESULT:"/lesson/:id/result",
  }

  
};
