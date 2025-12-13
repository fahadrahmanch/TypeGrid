import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
interface Props {
  children: ReactNode;
  allowedRoles:string[];
}
interface PropsIsloggedCompany{
children:ReactNode;
}

export default function   ProtectRouteCompany({ children ,allowedRoles}: Props) {
  const accessToken = useSelector((state: any) => state.companyAuth.accessToken);
  const user = useSelector((state: any) => state.companyAuth.user);
  const authLoaded = useSelector((state: any) => state.companyAuth.authLoaded);

  if (!authLoaded) return <div>Loading...</div>;

  if (!accessToken) {
    return <Navigate to="/company/signin" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/company/user/dashboard" replace />;
  }


  return children;
}
export function IsloggedCompany({ children }: PropsIsloggedCompany) {
  const accessToken = useSelector(
    (state: any) => state?.companyAuth.accessToken,
  );
  const authLoaded = useSelector((state: any) => state?.companyAuth.authLoaded);
  const user = useSelector((state: any) => state?.companyAuth.user);

  if (!authLoaded) {
    return <div>Loading...</div>;
  }

  if (!accessToken) {
    return children;
  }

  if (user?.role === "companyAdmin") {
    return <Navigate to="/company/admin/dashboard" replace />;
  }

  if (user?.role === "companyUser") {
    return <Navigate to="/company/user/dashboard" replace />;
  }

  return <Navigate to="/company/signin" replace />;
}
