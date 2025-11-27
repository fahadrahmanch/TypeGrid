import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
interface Props {
  children: ReactNode;
}

export default function ProtectRouteCompany({ children }: Props) {
  const accessToken = useSelector(
    (state: any) => state?.companyAuth.accessToken,
  );
  const authLoaded = useSelector((state: any) => state?.companyAuth.authLoaded);
  if (!authLoaded) {
    return <div>Loading...</div>;
  }
  if (!accessToken) {
    return <Navigate to="/company/signin" replace />;
  }
  return children;
}
export function IsloggedCompany({ children }: Props) {
  const accessToken = useSelector(
    (state: any) => state?.companyAuth.accessToken,
  );
  const authLoaded = useSelector((state: any) => state?.companyAuth.authLoaded);
  if (!authLoaded) {
    return <div>Loading...</div>;
  }

  if (!accessToken) {
    return children;
  }
  return <Navigate to="/company/admin/dashboard" replace />;
}
