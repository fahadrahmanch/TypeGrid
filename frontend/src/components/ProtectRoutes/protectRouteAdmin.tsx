import { useSelector } from "react-redux";
import { Navigate,Outlet } from "react-router-dom";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ProtectRouteAdmin() {
  const { accessToken, authLoaded } = useSelector((state: any) => state.auth);
  if (!authLoaded) {
    return <div>Loading...</div>;
  }

  if (!accessToken) {
    return <Navigate to="/admin/signin" replace />;
  }
  return <Outlet />;
}

export function IsloggedAdmin({ children }: Props) {
  const { accessToken, authLoaded } = useSelector((state: any) => state.auth);
  if (!authLoaded) {
    return <div>Loading...</div>;
  }

  if (!accessToken) {
    return children;
  }
  return <Navigate to="/admin/users" replace />;
}
