import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { ReactNode } from "react";
interface Props {
  children: ReactNode;
  
}

export default function ProtectRouteUser() {
  const { accessToken, authLoaded } = useSelector((state: any) => state.auth);

  if (!authLoaded) {
    return <div>Loading...</div>;
  }

  if (!accessToken) {
    return <Navigate to="/Signin" replace />;
  }

  return <Outlet />;
}
export function IsloggedUser({ children }: Props) {
  const { accessToken, authLoaded } = useSelector((state: any) => state.auth);

  if (!authLoaded) {
    return <div>Loading...</div>;
  }

  if (!accessToken) {
    return children;
  }
  return <Navigate to="/" replace />;
}
