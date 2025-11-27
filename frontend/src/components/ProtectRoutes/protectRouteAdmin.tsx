import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
interface Props {
  children: ReactNode;
}

export default function ProtectRouteAdmin({ children }: Props) {
  const accessToken = useSelector((state: any) => state?.adminAuth.accessToken);
  const authLoaded = useSelector((state: any) => state?.adminAuth.authLoaded);
  if (!authLoaded) {
    return <div>Loading...</div>;
  }
  if (!accessToken) {
    return <Navigate to="/admin/signin" replace />;
  }
  return children;
}
export function IsloggedAdmin({ children }: Props) {
  const accessToken = useSelector((state: any) => state?.adminAuth.accessToken);
  const authLoaded = useSelector((state: any) => state?.adminAuth.authLoaded);
  if (!authLoaded) {
    return <div>Loading...</div>;
  }

  if (!accessToken) {
    return children;
  }
  return <Navigate to="/admin/users" replace />;
}
