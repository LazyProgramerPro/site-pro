import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import UserApi from "../../services/userApi";
import LoadingToRedirect from "./LoadingToRedirect";

const ProtectedRouteAdmin = ({ children }: { children: JSX.Element }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user && user.token) {
      UserApi.getCurrentAdmin()
        .then((res) => {
          console.log("CURRENT ADMIN RES", res);
          setIsAdmin(true);
        })
        .catch((err) => {
          console.log("ADMIN ROUTE ERR", err);
          setIsAdmin(false);
        });
    }
  }, [user]);

  if (isAdmin) {
    // If authenticated, render the protected component
    return <>{children}</>;
  }

  // If not authenticated, redirect to the login page

  return <LoadingToRedirect />;
};

export default ProtectedRouteAdmin;
