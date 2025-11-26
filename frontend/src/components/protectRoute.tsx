import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
interface Props {
  children: ReactNode;
}

export default function ProtectRoute({ children }: Props) {
  const accessToken = useSelector((state: any) => state?.userAuth.accessToken);
  const authLoaded = useSelector((state: any) => state?.userAuth.authLoaded);
  if (!authLoaded) {
    return <div>Loading...</div>;
  }
  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }
  return children;
}
export function Islogged({ children }: Props) {
  const accessToken = useSelector((state: any) => state?.userAuth.accessToken);
  const authLoaded = useSelector((state: any) => state?.userAuth.authLoaded);
  if (!authLoaded) {
    return <div>Loading...</div>;
  }

  if (!accessToken) {
    return children;
  }
  return <Navigate to="/" replace />;
}