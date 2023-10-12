import { Search } from "@mui/icons-material";
import { Button, Input, Spin } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
// import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useGetApi } from "../../hooks/useGetApi";
import { Header } from "../../components/header/Header";
import { PageContent } from "../../components/page-content/PageContent";
import { BellOutlined } from "@ant-design/icons";
import CircleIcon from "@mui/icons-material/Circle";
import { formatDate, formateDate } from "../../utils/convertSlotToString";
import { getNotificationCount } from "../../redux/services/getNotificationCount";

const markAllAsRead = async (userId) => {
  try {
    await axios({
      url: `${process.env.REACT_APP_BASE_URL}/api/notifications/mark-all-as-read/`,
      method: "PUT",
      data: {
        user_id: userId,
      },
    });
  } catch (error) {
    console.error("Failed to mark all as read", error);
  }
};

const markAsRead = async (notificationId, userId) => {
  try {
    await axios({
      url: `${process.env.REACT_APP_BASE_URL}/api/notifications/mark-as-read/`,
      method: "PUT",
      data: {
        notification_ids: notificationId,
        user_id: userId,
      },
    });
  } catch {}
};

// const formatDate = (date) => {
//   return moment(date).format("DD-MM-YYYY hh:mm a");
// };

const categorizeNotifications = (sortedNotifications) => {
  const today = [];
  const lastWeek = [];
  const previous = [];
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  sortedNotifications.forEach((notification) => {
    const date = new Date(notification.created_at);
    const timeDifference = endOfDay.getTime() - date.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

    if (daysDifference === 0) {
      today.push(notification);
    } else if (daysDifference < 7) {
      lastWeek.push(notification);
    } else {
      previous.push(notification);
    }
  });

  return {
    today,
    lastWeek,
    previous,
  };
};

const CATEGORIES = [
  { key: "today", title: "Today" },
  { key: "lastWeek", title: "Last Week" },
  { key: "previous", title: "Previous" },
];

const commonClass = "border-b p-2 cursor-pointer";

const Notification = ({ notification }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        if (!notification.read) {
          markAsRead(notification.id, notification.user);
        }
        navigate(notification.path);
      }}
      className={`${commonClass} ${
        notification?.read_status === true
          ? "bg-white hover:shadow-md mb-[.5rem] hover:bg-gray-100 flex"
          : "bg-gray-200 border-b border-t mb-[.5rem] hover:bg-gray-300 shadow-md flex"
      }`}
    >
      <div>
        <div className="flex gap-4 p-2">
          <div className="mt-2 relative">
            {notification?.read_status === false ? (
              <span className="absolute">
                <CircleIcon className="!text-[10px] text-primary-1" />
              </span>
            ) : (
              ""
            )}
            <BellOutlined className="!text-[24px] text-gray-400  bg-gray-200 rounded-full p-3" />
          </div>
          <div>
            <div className="font-semibold text-lg">Notification </div>
            <div className="mt-[.5rem]">{notification.message}</div>
          </div>
        </div>
      </div>
      <div className="ml-auto">
        <div
          //  className="mt-4 mb-2 flex px-16 text-gray-400"
          className="text-gray-400 mt-[2.7rem]"
        >
          {/* <div>{notification.project_name}</div> */}
          <div className="">{formatDateTime(notification.created_at)}</div>
        </div>
      </div>
    </div>
  );
};

const formatDateTime = (createdAt) => {
  const options = {
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDateTime = new Date(createdAt).toLocaleString(
    "en-US",
    options
  );
  return formattedDateTime;
};

export const NotificationPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [searchText, setSearchText] = useState("");
  const [allNotificationsRead, setAllNotificationsRead] = useState(false);
  const dispatch = useDispatch();
  const {
    data: notificationsData,
    isLoading: notificationsLoading,
    error: notificationsError,
    getData: getNotifications,
  } = useGetApi(
    `${process.env.REACT_APP_BASE_URL}/api/notifications/all/${user.user.user}`
  );

  useEffect(() => {
    if (notificationsData) {
      // Check if all notifications are read
      const allRead = notificationsData.every(
        (notification) => notification.read_status === true
      );
      setAllNotificationsRead(allRead);
    }
  }, [notificationsData]);

  const handleMarkAllAsRead = async () => {
    await markAllAsRead(user.user.user);
    // Reload the page
    getNotifications();
    dispatch(getNotificationCount(user?.user.user));
  };

  let categorizedNotifications;
  if (notificationsData) {
    const filteredNotifications = notificationsData.filter((notification) =>
      notification.message.toLowerCase().includes(searchText.toLowerCase())
    );
    categorizedNotifications = categorizeNotifications(filteredNotifications);
  }

  if (notificationsLoading) {
    return <Spin />;
  } else if (notificationsError) {
    return <p>Failed to load data</p>;
  } else if (notificationsData) {
    return (
      <main className="bg-gray-100/5">
        <Header>
          <div className="flex">
            <div>Notifications</div>
            <div className="ml-auto">
              <Input
                className="w-auto"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<Search />}
                placeholder="Search..."
              />
            </div>{" "}
          </div>
        </Header>
        <PageContent>
          {notificationsData.length === 0 ? (
            <div className="text-center text-gray-400">No notifications</div>
          ) : (
            <div className="flex flex-col">
              <div className="ml-auto">
                <Button
                  onClick={handleMarkAllAsRead}
                  disabled={allNotificationsRead}
                >
                  Mark All As Read
                </Button>
              </div>
              <div className="">
                {CATEGORIES.map((category) => {
                  const categoryNotifications =
                    categorizedNotifications[category.key];
                  if (categoryNotifications.length > 0) {
                    const categoryTitle =
                      category.key === "today"
                        ? "Today, " + formatDate(new Date())
                        : category.key === "lastWeek"
                        ? "Last Week, " +
                          formatDate(
                            new Date(
                              new Date().setDate(new Date().getDate() - 7)
                            )
                          )
                        : "Previous, " +
                          formatDate(
                            new Date(
                              new Date().setDate(new Date().getDate() - 7)
                            )
                          );
                    return (
                      <>
                        <div className="text-center mt-[1rem] p-3 mb-[.8rem] border-b">
                          <span className="inline-block mn-2 border p-3 rounded-lg">
                            {categoryTitle}
                          </span>
                        </div>
                        {categoryNotifications.map((notification) => {
                          return <Notification notification={notification} />;
                        })}
                      </>
                    );
                  } else {
                    return <></>;
                  }
                })}
              </div>
            </div>
          )}
        </PageContent>
      </main>
    );
  }
  return <div>Some error occured</div>;
};
