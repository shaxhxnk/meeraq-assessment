import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { USER_BASED_ROUTES } from "../../constants";

const AuthenticatedRoutes = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const { pathname } = useLocation();

  let isRouteAllowed;

  if (isAuthenticated) {
    isRouteAllowed = USER_BASED_ROUTES[user?.user?.type].includes(pathname);

    if (user.user.type === "pmo" && !isRouteAllowed) {
      isRouteAllowed = pathname.startsWith("/assessments");
    }
    if (user.user.type === "learner" && !isRouteAllowed) {
      isRouteAllowed = pathname.startsWith("/participant/assessments");
    }
  }

  return isAuthenticated ? (
    isRouteAllowed ? (
      <div style={{ height: "100vh", overflowY: "auto" }} className="bg-bg-4">
        <Outlet />
      </div>
    ) : (
      <Navigate to="/pagenotfound" />
    )
  ) : (
    <Navigate to="/" replace={true} state={{ from: pathname }} />
  );
};

export { AuthenticatedRoutes };
