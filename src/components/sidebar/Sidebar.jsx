import { Avatar, Button, Layout, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import MeeraqLogoColored from "../../assets/meeraq_logo_color.png";
import LogoutIcon from "@mui/icons-material/Logout";
import { logout } from "../../redux/services/authService";
import { NotificationAddOutlined } from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { NotificationNavItem } from "../notification-nav-item/NotificationNavItem";
import PmoImage from "../../assets/pmo.jpg";
import { UserAddOutlined, UserOutlined } from "@ant-design/icons";
import MaleCoach from "../../assets/male.png";
import FemaleCoach from "../../assets/female.png";
import { formateDate } from "../../utils/convertSlotToString";

export const Sidebar = ({ menu }) => {
  const { user } = useSelector((state) => state.auth);
  const userType = user.user.type;
  const dispatch = useDispatch();
  return (
    <Layout.Sider
      style={{
        width: "263px",
        // backgroundColor: "#0a80b6",
        // color: "white",
      }}
      className="min-h-screen border-0 border-r sidebar"
      breakpoint={"lg"}
      theme="light"
      collapsedWidth={0}
      trigger={null}
    >
      <div className="px-[16px] py-[12px] flex flex-col h-full">
        <div
          style={{
            padding: "24px 8px 12px 8px",
          }}
        >
          <img
            className="w-[10.875rem] h-auto"
            src={MeeraqLogoColored}
            alt="Meeraq Logo"
          />
        </div>
        {menu}
        <NotificationNavItem />
        <div className="mt-auto">
          <div className="flex items-center gap-[12px]  border-0 pt-2 border-t">
            <Avatar
              icon={
                userType === "learner" || userType === "hr" ? (
                  <UserOutlined className="flex justify-center p-1 text-black" />
                ) : null
              }
              src={
                userType === "pmo" || userType === "coach" ? (
                  <img
                    src={
                      userType === "pmo"
                        ? PmoImage
                        : userType === "coach"
                        ? user.profile_pic
                          ? user.profile_pic
                          : user.gender === "Female"
                          ? FemaleCoach
                          : MaleCoach
                        : undefined
                    }
                    alt="user profile"
                  />
                ) : undefined
              }
              size={30}
            />

            <div className=" max-w-[130px]">
              <p className="text-ellipsis whitespace-nowrap	 overflow-hidden m-body4 text-text-1 font-medium capitalize">
                {user.name ? (
                  user.name
                ) : (
                  <span className="capitalize">
                    {user.first_name} {user.last_name}
                  </span>
                )}
              </p>
              <p className="text-ellipsis whitespace-nowrap	 overflow-hidden text-text-4 font-normal">
                {user.email}
              </p>
            </div>
            <Tooltip title="Logout">
              <Button
                onClick={() => dispatch(logout())}
                type="text"
                className="m-icon-btn"
              >
                <LogoutIcon />
              </Button>
            </Tooltip>
          </div>
          <div className="mt-[.5rem]">
            <span className="font-semibold">Last login:</span>{" "}
            <span>{formateDate(user?.last_login)}</span>
            {"  "}
          </div>
        </div>
      </div>
      {/* </div> */}
    </Layout.Sider>
  );
};
