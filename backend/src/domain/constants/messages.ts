export const MESSAGES = {
  // ================= AUTH =================
  AUTH_LOGIN_SUCCESS: "Logged in successfully",
  AUTH_REGISTER_SUCCESS: "Registered successfully",
  AUTH_INVALID_CREDENTIALS: "Invalid email or password",
  AUTH_USER_NOT_FOUND: "User not found",
  AUTH_EMAIL_EXISTS: "Account already exists with this email",
  AUTH_TOKEN_MISSING: "Token missing",
  AUTH_TOKEN_INVALID: "Invalid or expired token",
  AUTH_LOGOUT_SUCCESS: "Logged out successfully",
  AUTH_ACCOUNT_BLOCKED: "Your account is blocked. Contact admin.",
  AUTH_INCORRECT_PASSWORD: "The password you entered is incorrect.",
  REFRESH_TOKEN_NOT_FOUND: "No refresh token found",
  REFRESH_TOKEN_EXPIRED_OR_INVALID: "Refresh token expired or invalid",
  GOOGLE_LOGIN_SUCCESS: "Google login successful",
  GOOGLE_ACCOUNT_PASSWORD_RESET_NOT_ALLOWED:
    "This account is registered using Google Sign-In. Password reset is not applicable.",
  PASSWORD_UPDATE_SUCCESS: "Password updated successfully.",
  UNAUTHORIZED: "Unauthorized: user not authenticated",
AUTH_UNAUTHORIZED_ROLE: "You are not authorized to login with this role.",
  ADMIN_NOT_FOUND: "Admin not found",

  // ================= USER / COMPANY ACCESS =================
  ACCESS_DENIED_NOT_COMPANY: "Access denied: Not a company account",
  ACCESS_DENIED_ADMIN_ONLY: "Access denied: Only admin can perform this action",
  USER_BLOCKED_SUCCESS: "User blocked successfully",
  USER_UNBLOCKED_SUCCESS: "User unblocked successfully",
  USER_ALREADY_BLOCKED: "User is already blocked",
  USER_ALREADY_ACTIVE: "User is already active",
  USER_DETAILS_NOT_FOUND: "We couldn’t find a user with the provided details",
  USERS_FETCHED_SUCCESS: "Users fetched successfully",
  ACCOUNT_BLOCKED_ACCESS_DENIED: "Access denied. This account is blocked",
  USER_DELETED_SUCCESS: "User deleted successfully",
  USER_ADDED_SUCCESS: "User added successfully",
  COMPANY_REQUEST_SUBMITTED_SUCCESS: "Company request submitted successfully",
  COMPANY_STATUS_FETCHED_SUCCESS: "Company status fetched successfully",
  // =============== USER (ERROR) ===============
  USERS_FETCH_FAILED: "Something went wrong while fetching users",

  // ================= COMPANY DETAILS =================
  COMPANY_CREATED_SUCCESS: "Company created successfully",
  COMPANY_UPDATED_SUCCESS: "Company updated successfully",
  COMPANY_NOT_FOUND: "Company not found",
  COMPANIES_FETCHED_SUCCESS: "Companies fetched successfully",
  COMPANY_APPROVED_SUCCESS: "Company approved successfully",
  COMPANY_REJECTED_SUCCESS: "Company rejected successfully",

  // ================= COMPANY ERRORS =================
  COMPANY_APPROVAL_SERVER_ERROR:
    "Internal server error while approving company",

  // ================= CONTACTS / CLIENTS =================
  CONTACT_ADDED_SUCCESS: "Contact added successfully",
  CONTACT_UPDATED_SUCCESS: "Contact updated successfully",
  CONTACT_DELETED_SUCCESS: "Contact deleted successfully",
  CONTACT_NOT_FOUND: "Contact not found",
  COMPANY_NOT_FOUND_OR_REMOVED: "Company does not exist or has been removed.",
  INVALID_COMPANY_REFERENCE: "Invalid company reference",
  COMPANY_ACCOUNT_INACTIVE: "Company account is inactive",

  // =============== ACCESS CONTROL / COMPANY PORTAL ===============
  UNAUTHORIZED_COMPANY_PORTAL_ACCESS:
    "You are not authorized to login from company portal",
  MISSING_COMPANY_ASSOCIATION: "Access denied: Missing company association",
  COMPANY_NOT_ASSIGNED_TO_USER:
    "Access denied. Company not assigned to this user.",
  COMPANY_USERS_FETCHED_SUCCESS: "Company users fetched successfully.",

  // ================= GENERAL CRUD / COMMON =================
  FETCH_SUCCESS: "Data fetched successfully",
  CREATE_SUCCESS: "Created successfully",
  UPDATE_SUCCESS: "Updated successfully",
  DELETE_SUCCESS: "Deleted successfully",
  INVALID_REQUEST: "Invalid request",
  VALIDATION_ERROR: "Validation failed",
  SOMETHING_WENT_WRONG: "Something went wrong. Please try again later",
  INTERNAL_SERVER_ERROR: "Internal server error",
  // ================= VALIDATION =================
  PASSWORD_REQUIRED: "Password is required",
  ALL_FIELDS_REQUIRED: "All fields are required",
  EMAIL_REQUIRED: "Email is required",
  REQUEST_BODY_MISSING: "Request body is missing",

  // ================= OTP =================
  OTP_VERIFICATION_FAILED: "OTP verification failed",
  OTP_SENT_SUCCESS: "OTP sent successfully",
  OTP_RESENT_SUCCESS: "OTP resent successfully.",
  OTP_VERIFIED_SUCCESS: "OTP verified successfully",

  // ================= GROUP PLAY =================
  GROUP_CREATED_SUCCESS: "Group play created successfully",
  GROUP_UPDATED_SUCCESS: "Group play updated successfully",
  JOIN_LINK_AND_USER_ID_REQUIRED: "Join link and user ID are required",
  GROUP_UPDATE_FAILED: "Failed to update group",

  LESSON_NOT_FOUND: "Lesson not found",

  // ================= SOLO PLAY =================
  SOLO_CREATED_SUCCESS: "Solo play created successfully",
  SOLO_UPDATED_SUCCESS: "Solo play updated successfully",

  GAME_ID_NOT_FOUND: "Game ID not found",

  // company lesson
  COMPANY_LESSON_NOT_FOUND: "Company lesson not found",
  COMPANY_LESSON_UPDATED_SUCCESS: "Company lesson updated successfully",

  //quick play
  QUICK_PLAY_START_FAILED: "Failed to start quick play",
  COMPETITION_NOT_FOUND: "Competition not found",
  USER_NOT_PARTICIPANT: "User is not a participant in this competition",
  STATUS_REQUIRED: "Status is required",

  //company group
  GROUP_DATA_REQUIRED: "Group data is required",
  USER_NOT_PART_OF_ANY_COMPANY: "User is not part of any company",
  GROUPS_FETCHED_SUCCESS: "Groups fetched successfully",
  GROUP_NOT_FOUND: "Group not found",

  CONTEST_NOT_FOUND: "Contest not found",
  CONTEST_JOINED_SUCCESS: "Contest joined successfully",
  CONTEST_LEAVED_SUCCESS: "Contest leaved successfully",

  // ================= NEW ERRORS =================
  USER_NOT_JOINED_CONTEST: "You have not joined this contest",
  GROUP_EXPIRED: "Group expired",
  USER_NO_COMPANY_ASSIGNED: "User does not have a company assigned",
  DATE_OR_START_TIME_REQUIRED: "Date or Start Time missing",
  CONTESTS_NOT_FOUND: "Contests not found",
  CHALLENGE_NOT_FOUND: "Challenge not found",
  PLAYER_NOT_FOUND: "Player not found",
  CANNOT_CHALLENGE_SELF: "You cannot challenge yourself",
  SENDER_OR_RECEIVER_NOT_FOUND: "Sender or Receiver not found",
  USERS_MUST_BELONG_TO_SAME_COMPANY: "Both users must belong to same company",
  COMPETITION_NOT_FOUND_FOR_CHALLENGE:
    "Competition not found for this challenge",
  ASSIGNED_LESSON_NOT_FOUND: "Assigned lesson not found",
  LESSON_RESULT_SAVE_FAILED: "Failed to save lesson result",
  LESSON_ID_REQUIRED: "Lesson ID is required",
  INVALID_CURRENT_PASSWORD: "Invalid current password",
  HOST_USER_ID_REQUIRED:
    "Host user ID is required to create a group play room.",
  GAME_ALREADY_ONGOING:
    "Cannot start a new game. The current game is not completed yet.",
  NO_GROUP_ASSOCIATED: "No group associated with this competition.",
  NO_LESSONS_FOUND_FOR_LEVEL: "No lessons found for this level",
  ONLY_HOST_CAN_EDIT_GROUP: "Only host can edit group settings",

  // ================= CONTROLLER ERRORS =================
  LEVEL_AND_CATEGORY_REQUIRED: "Level and Category are required",
  GROUP_PLAY_ROOM_CREATE_FAILED: "Failed to create group play room.",
  JOIN_ID_REQUIRED_FOR_GROUP_DETAILS:
    "Join ID is required to fetch group details.",
  GROUP_NOT_FOUND_WITH_JOIN_ID: "Group not found with the provided join ID.",
  GROUP_ID_REQUIRED_TO_EDIT: "Group ID is required to edit group details.",
  DIFFICULTY_AND_MAX_PLAYERS_REQUIRED:
    "Difficulty and max players are required",
  JOIN_ID_REQUIRED_TO_JOIN: "Join ID is required to join group.",
  GROUP_ID_REQUIRED_TO_REMOVE_MEMBER: "Group ID is required to remove member.",
  GROUP_ID_REQUIRED_TO_START_GAME: "Group ID is required to start game.",
  GAME_ID_REQUIRED_TO_START_NEW_GAME: "Game ID is required to start new game.",
  AT_LEAST_ONE_USER_REQUIRED:
    "At least one user is required to start new game.",
  LESSON_DATA_REQUIRED: "Lesson data is required",
  COMPANY_OWNER_NOT_FOUND: "Company OwnerId not found",
  USER_ID_REQUIRED_QUICK_PLAY: "User ID is required to start quick play.",
  NO_LESSONS_FOUND_FOR_CRITERIA:
    "No lessons found for the given level and category",
  COMPANY_ALREADY_REGISTERED: "You have already registered a company",
  SENDER_ID_REQUIRED: "senderId are required",
  UNAUTHORIZED_PORTAL_ACCESS:
    "You are not authorized to login from this portal",


    //company user
      LESSON_UPDATE_FAILED: "Failed to update lesson",


};
