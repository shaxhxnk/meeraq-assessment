import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { USER_BASED_ROUTES } from "../../constants";
import { getCSRF } from "../../redux/services/authService";
import { EmailPasswordLogin } from "./EmailPasswordLogin";
import { OtpLogin } from "./OtpLogin";

export const Login = () => {
  const [isLoggingWithOtp, setIsLoggingWithOtp] = useState(false);
  const { isAuthenticated, isLoading, error, csrf, user } = useSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();

  useEffect(() => {
   
    // pmoAssessment
    if (isAuthenticated) {
      if (state?.from) {
        navigate(state.from);
      } else {
          navigate(USER_BASED_ROUTES[user.user.type][0]);
      }
    }
  }, [isAuthenticated, navigate, user, state]);

  // setting new csrf when no session available and also resetting the location state
  useEffect(() => {
    if (!isAuthenticated && !isLoading && !error && !csrf) {
      navigate("", { state: null });
      dispatch(getCSRF());
    }
  }, [isAuthenticated, isLoading, error, csrf, dispatch, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center">
        <Spin />
      </div>
    );
  } else
    return isLoggingWithOtp ? (
      <OtpLogin setIsLoggingWithOtp={setIsLoggingWithOtp} />
    ) : (
      <EmailPasswordLogin setIsLoggingWithOtp={setIsLoggingWithOtp} />
    );
};
