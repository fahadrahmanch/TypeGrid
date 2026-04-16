import { companyAPI } from "../axios/companyAPI";
import { API_ROUTES } from "../../constants/apiRoutes";
export const setKeyboardLayout = async (keyboardLayout: string) => {
  return companyAPI.put(API_ROUTES.SET_KEYBOARD_LAYOUT, { keyboardLayout });
};
