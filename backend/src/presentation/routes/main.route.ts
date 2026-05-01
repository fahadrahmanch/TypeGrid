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
    GET_DASHBOARD_STATS: "/dashboard/stats",
    GET_USERS: "/users",

    GET_COMPANYS: "/companies",

    //post
    // APPROVE_COMPANY:"/approve/company",
    // REJECT_COMPANY:"/reject/company",

    UPDATE_COMPANY_STATUS: "/companies/:companyId/status",

    CREATE_LESSON: "/lessons",
    FETCH_LESSONS: "/lessons",
    FETCH_LESSON: "/lesson/:id",
    UPDATE_LESSON: "/lesson/:id",
    DELETE_LESSON: "/lesson/:id",
    //patch
    UPDATE_USER_STATUS: "/users/:userId/status",
    //reward
    CREATE_REWARD: "/rewards",
    FETCH_REWARS: "/rewards",
    FETCH_REWARD_BY_ID: "/rewards/:id",
    UPDATE_REWARD: "/rewards/:id",
    DELETE_REWARD: "/rewards/:id",

    //goals
    CREATE_GOAL: "/goals",
    FETCH_GOALS: "/goals",
    FETCH_GOAL_BY_ID: "/goals/:id",
    UPDATE_GOAL: "/goals/:id",
    DELETE_GOAL: "/goals/:id",

    //challenge
    CREATE_CHALLENGE: "/challenges",
    FETCH_CHALLENGES: "/challenges",
    FETCH_CHALLENGE_BY_ID: "/challenges/:id",
    UPDATE_CHALLENGE: "/challenges/:id",
    DELETE_CHALLENGE: "/challenges/:id",

    //daily assign challenge
    CREATE_DAILY_ASSIGN_CHALLENGE: "/daily-assign-challenge",
    FETCH_DAILY_ASSIGN_CHALLENGE: "/daily-assign-challenges",
    FETCH_DAILY_ASSIGN_CHALLENGE_BY_ID: "/daily-assign-challenge/:id",
    UPDATE_DAILY_ASSIGN_CHALLENGE: "/daily-assign-challenge/:id",
    DELETE_DAILY_ASSIGN_CHALLENGE: "/daily-assign-challenge/:id",

    //acheivements
    CREATE_ACHIVEMENT: "/achievement",
    FETCH_ACHIVEMENTS: "/achievements",
    FETCH_ACHIVEMENT_BY_ID: "/achievement/:id",
    UPDATE_ACHIVEMENT: "/achievement/:id",
    DELETE_ACHIVEMENT: "/achievement/:id",

    //subscription
    CREATE_SUBSCRIPTION_PLAN: "/subscription",
    FETCH_SUBSCRIPTION_NORMAL_PLANS: "/subscription/normal",
    FETCH_SUBSCRIPTION_COMPANY_PLANS: "/subscription/company",
    FETCH_SUBSCRIPTION_PLAN_BY_ID: "/subscription/:id",
    UPDATE_SUBSCRIPTION_PLAN: "/subscription/:id",
    DELETE_SUBSCRIPTION_PLAN: "/subscription/:id",
  },

  USERS: {
    // profile
    GET_PROFILE: "/me",
    UPDATE_PROFILE: "/me",
    CHANGE_PASSWORD: "/password",
    // company subscription
    VERIFY_COMPANY: "/company/verification",
    RE_VERIFY_COMPANY: "/company/verification/retry",
    GET_COMPANY_STATUS: "/company/status",

    // typing practice
    GET_RANDOM_PRACTICE_LESSON: "/typing/practice",
    GET_LESSON_BY_ID: "/typing/practice/:lessonId",

    // group
    GROUP_PLAY: {
      CREATE_GROUP: "/group-play/groups",
      GET_GROUP: "/group-play/groups/:joinLink",
      EDIT_GROUP: "/group-play/groups/:groupId",
      JOIN_GROUP: "/group-play/groups/join/:joinLink",
      REMOVE_MEMBER: "/group-play/groups/:groupId/players/:playerId",
      NEW_GAME: "/group-play/:gameId/new-game",
      //play
      START_GAME: "/group-play/groups/:groupId/start",
    },
    SOLO_PLAY: {
      SOLO_CREATE: "/solo-play",
      RESULT_SOLO_PLAY: "/solo-result:gameId",
    },
    QUICK_PLAY: {
      START_QUICK_PLAY: "/quick-play/start",
      CHANGE_STATUS: "/quick-play/start/:competitionId",
    },

    //challenge
    GET_TODAY_CHALLENGE: "/today-challenge",
    //daily challenge  user
    DAILY_CHALLENGE_FINISHED: "/daily-challenge-finished",
    DAILY_CHALLENGE_STATISTICS: "/daily-challenge/statistics",
    LEADERBOARD: "/leaderboard",


    //subscription
    SUBSCRIPTION: "/subscription/plans",
    CANCEL_SUBSCRIPTION: "/subscription/cancel",
    CANCEL_COMPANY_SUBSCRIPTION: "/subscription/cancel-company",
    SUBSCRIPTION_DETAILS: "/subscription/details",
    COMPANY_PLANS: "/subscription/company-plans",
    CREATE_SESSION: "/subscription/create-session",
    CREATE_COMPANY_SESSION: "/subscription/create-company-session",
    CONFIRM_SUBSCRIPTION: "/subscription/confirm",
    CONFIRM_COMPANY_SUBSCRIPTION: "/subscription/confirm-company",
    ACHIEVEMENTS: {
      GET_ALL: "/achievements",
      GET_USER_ACHIEVEMENTS: "/achievements/me",
    },
    GET_COMPANY_DETAILS: "/company/details",
    CREATE_POST: "/discussions/create-post",
    GET_ALL_DISCUSSIONS: "/discussions",
    GET_DISCUSSION_BY_ID: "/discussions/:id",
    DELETE_DISCUSSION: "/discussions/:id",
    CREATE_COMMENT: "/discussions/create-comment",

    CREATE_REPLY: "/discussions/create-reply",
    GET_MY_DISCUSSIONS: "/discussions/my-discussions",
    GET_ANOTHER_PROFILE: "/profile/:userId",
  },

  COMPANY_ADMIN: {
    DASHBOARD_STATS: "/dashboard/stats",
    ADD_USER: "/users",
    GET_COMPANY_USERS: "/users",
    DELETE_COMPANY_USER: "/users/:userId",

    //lesson
    CREATE_LESSON: "/lesson",
    FETCH_LESSONS: "/lessons",
    FETCH_LESSON: "/lesson/:id",
    UPDATE_LESSON: "/lesson/:id",
    DELETE_LESSON: "/lesson/:id",
    FETCH_LESSON_BY_ID: "/lesson/:id",
    GET_ADMIN_LESSONS: "/admin-lessons",
    ASSIGN_LESSON: "/lesson-assignments",
    ASSIGN_LESSON_TO_GROUP: "/lesson-assignments-lesson-group",
    GET_PENDING_USERS: "/lesson/pending-users",

    //companyGroup
    CREATE_COMPANY_GROUP: "/company-groups",
    GET_COMPANY_GROUPS: "/company-groups/",
    CREATE_COMPANY_GROUP_AUTO: "/company/groups-auto",
    GET_COMPANY_GROUP_BY_ID: "/company-groups/:id",
    DELETE_COMPANY_GROUP: "/company-groups/:id",
    REMOVE_MEMBER: "/company-groups/:groupId/members/:memberId",
    ADD_MEMBER: "/company-groups/:groupId/members-add/:memberId",
    COMPANY_USERS_WITH_STATUS: "/users/company-users-with-status",
    //companyContest
    CREATE_COMPANY_CONTEST: "/company/contest",
    COMPANY_CONTESTS: "/company/contests",
    CONTEST_STATUS: "/company/contest/:contestId/status",
    CONTEST_PARTICIPANTS: "/company/contest/:contestId/participants",
    FETCH_CONTEST_ADMIN: "/company/contest/:contestId/admin",
    UPDATE_CONTEST: "/company/contest/:contestId",
    DELETE_CONTEST: "/company/contest/:contestId",
    FETCH_CONTEST_RESULT: "/company/contest/:contestId/results",

    //notification
    SEND_INDIVIDUAL_NOTIFICATION: "/notification/individual",
    SEND_GROUP_NOTIFICATION: "/notification/group",
    SEND_ALL_NOTIFICATION: "/notification/all",
    GET_NOTIFICATION_HISTORY: "/notifications/history",

    //keyboard
    SET_KEYBOARD_LAYOUT: "/keyboard/set-keyboard-layout",

    GET_COMPANY_DETAILS: "/company/details",
  },

  COMPANY_USER: {
    DASHBOARD_STATS: "/dashboard-stats",
    PROFILE: "/profile/:userId",
    MY_LESSONS: "/my-lessons",
    ASSIGNED_LESSON_BY_ID: "/my-lessons/:assignmentId",
    SAVE_LESSON_RESULT: "/lesson/:id/result",

    OPEN_CONTESTS: "/open-contests",
    JOIN_OR_LEAVE_CONTEST: "/join-or-leave-contest/:contestId",
    GROUP_CONTESTS: "/group-contests",
    FETCH_CONTEST: "/company/contest/:contestId",
    FETCH_CONTEST_DATA: "/company/contest-area/:contestId",
    FETCH_COMPANY_USRS: "/company/users",
    GENERATE_TYPING_TEXT: "/typing/generate-text",

    ///challenge
    MAKE_CHALLENGE: "/challenge",
    CHECK_ALREAY_SEND: "/challenge/check-challenge-sent",
    GET_CHALLENGES: "/challenges",
    CHALLENGE_ACCEPT: "/challenge/accept/:challengeId",
    GET_CHALLENGE_GAME_DATA: "/challenge/game-data/:challengeId",
    REJECT_CHALLENGE: "/challenge/reject/:challengeId",

    LEADERBOARD: "/leaderboard/:limit",
    UPDATE_PASSWORD: "/profile/:userId/password",

    //notification
    GET_NOTIFICATIONS: "/notifications",
    MARK_NOTIFICATION_AS_READ: "/notifications/:id/read",
    GET_NOTIFICATION_HISTORY: "/notifications/history",
    SET_KEYBOARD_LAYOUT: "/keyboard/set-keyboard-layout",
  },
};
