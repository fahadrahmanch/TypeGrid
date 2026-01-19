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
  GOOGLE_ACCOUNT_PASSWORD_RESET_NOT_ALLOWED: "This account is registered using Google Sign-In. Password reset is not applicable.",
  PASSWORD_UPDATE_SUCCESS: "Password updated successfully.",
  UNAUTHORIZED: "Unauthorized: user not authenticated",

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
  COMPANY_APPROVAL_SERVER_ERROR: "Internal server error while approving company",

  // ================= CONTACTS / CLIENTS =================
  CONTACT_ADDED_SUCCESS: "Contact added successfully",
  CONTACT_UPDATED_SUCCESS: "Contact updated successfully",
  CONTACT_DELETED_SUCCESS: "Contact deleted successfully",
  CONTACT_NOT_FOUND: "Contact not found",
  COMPANY_NOT_FOUND_OR_REMOVED: "Company does not exist or has been removed.",
  INVALID_COMPANY_REFERENCE: "Invalid company reference",
  COMPANY_ACCOUNT_INACTIVE: "Company account is inactive",


    // =============== ACCESS CONTROL / COMPANY PORTAL ===============
  UNAUTHORIZED_COMPANY_PORTAL_ACCESS: "You are not authorized to login from company portal",
  MISSING_COMPANY_ASSOCIATION: "Access denied: Missing company association",
  COMPANY_NOT_ASSIGNED_TO_USER: "Access denied. Company not assigned to this user.",
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

  LESSON_NOT_FOUND: "Lesson not found",

  // ================= SOLO PLAY =================
  SOLO_CREATED_SUCCESS: "Solo play created successfully",
  SOLO_UPDATED_SUCCESS: "Solo play updated successfully",
  
  GAME_ID_NOT_FOUND: "Game ID not found",

};
