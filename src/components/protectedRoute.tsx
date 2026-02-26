import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import type { RootState } from "../app/store";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, token } = useSelector(
    (state: RootState) => state.auth
  );

  const location = useLocation();

  // Not logged in → redirect to login
  if (!isAuthenticated || !token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }} // so user can return after login
      />
    );
  }

  // Authorized → allow access
  return <>{children}</>;
};

export default ProtectedRoute;