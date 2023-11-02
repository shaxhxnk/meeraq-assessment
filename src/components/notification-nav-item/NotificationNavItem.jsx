import { NotificationAddOutlined } from "@mui/icons-material";
import { Badge, notification, Tooltip } from "antd";
import React, { useMemo } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
// import { useGetApi } from "../../hooks/useGetApi";
import { getNotificationCount } from "../../redux/services/getNotificationCount";

export const NotificationNavItem = () => {
  const { user } = useSelector((state) => state.auth);
  const { notificationCount } = useSelector((state) => state.notifications);
  const userType = useMemo(() => {
    return user.user.type;
  }, [user]);

  const { pathname } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (pathname) {
      dispatch(getNotificationCount(user.user.user));
    }
  }, [pathname, dispatch, user]);



  return (
    <NavLink
      to="/notifications"
      className={({ isActive }) =>
        `${
          isActive
            ? "bg-primary-4 text-primary-1 hover:text-primary-1"
            : "hover:bg-bg-3 hover:text-black"
        } p-[6px] flex gap-3 cursor-pointer rounded-lg `
      }
    >
      <NotificationAddOutlined />
      <Tooltip
        title={
          userType === "hr"
            ? "Click on any notification to go to the corresponding project"
            : ""
        }
        placement="bottom"
      >
        Notifications
      </Tooltip>

      {notificationCount && (
        <Badge
          className="ml-auto"
          count={notificationCount ? notificationCount.count : 0}
        />
      )}
    </NavLink>
  );
};
