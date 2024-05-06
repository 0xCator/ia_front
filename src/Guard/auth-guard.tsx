import { Navigate, Outlet } from "react-router-dom";
import { getUserData } from "../Services/userData";

interface Props {
    logRequired: boolean;
}

export const AuthGuard: React.FC<Props>  = (props) => {
  const user = getUserData();

  if (props.logRequired) {
    return <>{user!=null ? <Outlet/> : <Navigate to="/login" />}</>;
  } else {
    return <>{user==null ? <Outlet/> : <Navigate to="/" />}</>;
    }
}