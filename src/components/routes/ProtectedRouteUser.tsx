import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import LoadingToRedirect from "./LoadingToRedirect";

const ProtectedRouteUser = ({ children }: { children: JSX.Element }) => {
  const user = useSelector((state: RootState) => state.user.user);

  if (user && user.token) {
    // If authenticated, render the protected component
    return <>{children}</>;
  }

  // If not authenticated, redirect to the login page

  return <LoadingToRedirect />;
};

export default ProtectedRouteUser;
