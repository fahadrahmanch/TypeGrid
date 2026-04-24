export const API_ROUTES = {
  AUTH: {
    SIGNUP: "/auth/signup",
    OTP_VERIFY: "/auth/otp/verify",
    OTP_RESEND: "/auth/otp/resend",
    SIGNIN: "/auth/signin",
    REFRESH_TOKEN: "/auth/refresh-token",
    GOOGLE: "/auth/google",
    LOGOUT: "/auth/logout",
    PASSWORD_FORGOT: "/auth/password/forgot",
    PASSWORD_OTP_VERIFY: "/auth/password/otp/verify",
    PASSWORD_RESET: "/auth/password/reset",
  },
  USER: {
    ME: "/me",
    VERIFY_COMPANY: "/company/verification",
    RE_VERIFY_COMPANY: "/company/verification/retry",
    COMPANY_STATUS: "/company/status",
    CHANGE_PASSWORD: "/password",
    LEADERBOARD: "/leaderboard",
    //subscription
    SUBSCRIPTION: "/subscription/plans",
    COMPANY_PLANS: "/subscription/company-plans",
    CREATE_SUBSCRIPTION_SESSION: "/subscription/create-session",
    CREATE_COMPANY_SUBSCRIPTION_SESSION: "/subscription/create-company-session",
    CONFIRM_SUBSCRIPTION: "/subscription/confirm",
    CONFIRM_COMPANY_SUBSCRIPTION: "/subscription/confirm-company",
    //achivements
    ACHIEVEMENTS: {
      GET_ALL: "/achievements",
      GET_USER_ACHIEVEMENTS: "/achievements/user",
      GET_BY_ID: (id: string) => `/achievement/${id}`,
    },
    CANCEL_SUBSCRIPTION: "/subscription/cancel",
    CANCEL_COMPANY_SUBSCRIPTION: "/subscription/cancel-company",
    SUBSCRIPTION_DETAILS: "/subscription/details",

    //company
    GET_COMPANY_DETAILS: "/company/details",

    //discussions
    CREATE_POST: "/discussions/create-post",
    GET_ALL_DISCUSSIONS: "/discussions",
    CREATE_COMMENT: "/discussions/create-comment",
    CREATE_REPLY: "/discussions/create-reply",
  },
  QUICK_PLAY: {
    START: "/quick-play/start",
    STATUS: (competitionId: string) => `/quick-play/start/${competitionId}`,
  },
  GROUP_PLAY: {
    GROUPS: "/group-play/groups",
    GROUP_DETAILS: (joinLink: string) => `/group-play/groups/${joinLink}`,
    EDIT_GROUP: (groupId: string) => `/group-play/groups/${groupId}`,
    JOIN_GROUP: (joinLink: string) => `/group-play/groups/join/${joinLink}`,
    REMOVE_PLAYER: (groupId: string, playerId: string) => `/group-play/groups/${groupId}/players/${playerId}`,
    START_GAME: (gameId: string) => `/group-play/groups/${gameId}/start`,
    NEW_GAME: (gameId: string) => `/group-play/${gameId}/new-game`,
  },
  SOLO_PLAY: {
    START: "/solo-play",
    RESULT: (gameId: string) => `/solo-result${gameId}`,
  },
  TYPING: {
    PRACTICE: (level: string, category: string) => `/typing/practice?level=${level}&category=${category}`,
    LESSON_BY_ID: (lessonId: string) => `/typing/practice/${lessonId}`,
  },
  DAILY_CHALLENGE: {
    TODAY: "/today-challenge",
    FINISHED: "/daily-challenge-finished",
    STATISTICS: "/daily-challenge/statistics",
  },
  LEADERBOARD: {
    GET: (limit: number) => `/leaderboard/${limit}`,
  },
  CONTESTS: {
    OPEN: "/open-contests",
    JOIN_LEAVE: (contestId: string) => `/join-or-leave-contest/${contestId}`,
    GROUP: "/group-contests",
  },
  CHALLENGE: {
    SEND: "/challenge",
    CHECK_SENT: "/challenge/check-challenge-sent",
    COMPANY_USERS: "/company/users",
    BY_ID: (id: string) => `/challenges/${id}`,
    ALL_CHALLENGES: "/challenges",

    ACCEPT: (challengeId: string) => `/challenge/accept/${challengeId}`,
    GAME_DATA: (challengeId: string) => `/challenge/game-data/${challengeId}`,
    REJECT: (challengeId: string) => `/challenge/reject/${challengeId}`,
  },
  LESSONS: {
    MY_LESSONS: "/my-lessons",
    MY_LESSON_BY_ID: (assignmentId: string) => `/my-lessons/${assignmentId}`,
    ADMIN: {
      BASE: "/lessons",
      LESSON: "/lesson",
      BY_ID: (id: string) => `/lesson/${id}`,
      RESULT: (id: string) => `/lesson/${id}/result`,
      ASSIGNMENTS: "/lesson-assignments",
      ASSIGNMENTS_LESSON_GROUP: "/lesson-assignments-lesson-group",
      ADMIN_ONLY: "/admin-lessons",
    },
  },
  ADMIN: {
    SUBSCRIPTION: {
      BASE: "/subscription",
      BY_ID: (id: string) => `/subscription/${id}`,
      NORMAL: "/subscription/normal",
      COMPANY: "/subscription/company",
      UPDATE_SUBSCRIPTION_PLAN: (id: string) => `/subscription/${id}`,
      DELETE_SUBSCRIPTION_PLAN: (id: string) => `/subscription/${id}`,
    },
    REWARDS: {
      BASE: "/rewards",
      BY_ID: (id: string) => `/rewards/${id}`,
    },
    GOALS: {
      BASE: "/goals",
      BY_ID: (id: string) => `/goals/${id}`,
    },
    DAILY_ASSIGN: {
      CHALLENGES: "/daily-assign-challenges",
      CHALLENGE: "/daily-assign-challenge",
      BY_ID: (id: string) => `/daily-assign-challenge/${id}`,
    },
    COMPANIES: {
      BASE: "/companies",
      STATUS: (companyId: string) => `/companies/${companyId}/status`,
    },
    USERS: {
      FILTER: (search: string, status: string, page: number, limit: number) =>
        `/users?search=${search}&status=${status}&page=${page}&limit=${limit}`,
      BY_ID: (userId: string) => `/users/${userId}`,
      STATUS: (userId: string) => `/users/${userId}/status`,
      COMPANY_USERS: "/users",
    },
    COMPANY_CONTESTS: {
      BASE: "/company/contest",
      BY_ID: (contestId: string) => `/company/contest/${contestId}`,
      ADMIN: (contestId: string) => `/company/contest/${contestId}/admin`,
      AREA: (contestId: string) => `/company/contest-area/${contestId}`,
      LIST: "/company/contests",
      STATUS: (contestId: string) => `/company/contest/${contestId}/status`,
      PARTICIPANTS: (contestId: string) => `/company/contest/${contestId}/participants`,
      RESULTS: (contestId: string) => `/company/contest/${contestId}/results`,
    },
    COMPANY_GROUPS: "/company-groups",
    COMPANY_GROUPS_AUTO: "/company/groups-auto",
    REMOVE_MEMBER_FROM_GROUP: (groupId: string, memberId: string) => `/company-groups/${groupId}/members/${memberId}`,
    ADD_MEMBER_TO_GROUP: (groupId: string, memberId: string) => `/company-groups/${groupId}/members-add/${memberId}`,
    COMPANY_GROUP_BY_ID: (id: string) => `/company-groups/${id}`,
    ACHIEVEMENTS: {
      BASE: "/achievement",
      ALL: "/achievements",
      BY_ID: (id: string) => `/achievement/${id}`,
      DELETE: (id: string) => `/achievement/${id}`,
    },
  },
  GET_COMPANY_USER_PROFILE: (userId: string) => `/profile/${userId}`,
  UPDATE_COMPANY_PASSWORD: (userId: string) => `/profile/${userId}/password`,
  COMPANY_USERS_WITH_STATUS: "/users/company-users-with-status",
  //notification
  NOTIFICATION: {
    INDIVIDUAL: "/notification/individual",
    GROUP: "/notification/group",
    ALL: "/notification/all",
    GET_USER_NOTIFICATIONS: "/notifications",
    GET_NOTIFICATION_HISTORY: "/notifications/history",
    MARK_AS_READ: (id: string) => `/notifications/${id}/read`,
  },
  // keyboard
  SET_KEYBOARD_LAYOUT: "/keyboard/set-keyboard-layout",

  //company admin
  GET_COMPANY_DETAILS: "/company/details",
  GET_PENDING_USERS: "/lesson/pending-users",


} as const;
