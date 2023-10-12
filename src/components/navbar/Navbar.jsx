import { Button, Drawer } from "antd";
import { useState } from "react";
import { MenuOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/services/authService.js";
import moment from "moment/moment.js";
import momentTimezone from "moment-timezone";
import MeeraqLogo from "../../assets/meeraq_logo_color.png";
import { useLocation } from "react-router-dom";

const Navbar = ({ menu }) => {
  const [visible, setVisible] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const timezone = momentTimezone.tz.guess();
  let lastLogin;
  if (user?.last_login) {
    lastLogin = moment(user?.last_login)
      // .subtract(5, "hours")
      // .subtract(30, "minutes")
      .tz(timezone)
      .format("DD-MM-YYYY, h:mm A");
  }

  return (
    <>
      {pathname !== "/register" && (
        <nav
          className={
            "flex navbar items-center gap-2 py-[1rem] pl-[2rem] bg-white" +
            (isAuthenticated && !pathname.startsWith("/e/call")
              ? " lg:hidden"
              : "")
          }
        >
          <Button
            className={
              " flex items-center justify-center " +
              (isAuthenticated &&
              !pathname.startsWith(
                "/e/call" && !pathname.startsWith("/create-password")
              )
                ? "lg:hidden"
                : "hidden")
            }
            type="primary"
            icon={<MenuOutlined />}
            onClick={() => setVisible(true)}
          />
          <h1
            className={
              "inline-block text-lg " +
              (isAuthenticated && !pathname.startsWith("/e/call")
                ? "lg:hidden"
                : "")
            }
          >
            <div className="w-[7rem]">
              <img
                className="w-[100%] h-auto"
                src={MeeraqLogo}
                alt="Meeraq logo"
              />
            </div>
          </h1>
          <Drawer
            title="Meeraq"
            placement="left"
            onClick={() => setVisible(false)}
            onClose={() => setVisible(false)}
            open={visible}
          >
            {menu}
          </Drawer>
          <span className="ml-auto mr-4">
            {isAuthenticated && (
              <div className="ml-auto flex items-center gap-4">
                <div className="hidden sm:block">
                  <p className="font-semibold text-[#0a80b6]">
                    Welcome,{" "}
                    <span className="capitalize">
                      {user?.name
                        ? user.name
                        : user.first_name
                        ? user.first_name
                        : "User"}
                    </span>
                    !
                  </p>
                  {lastLogin && (
                    <p className="text-[0.8rem]">
                      Last Login: <span>{lastLogin + " IST"} </span>
                    </p>
                  )}
                </div>
                <Button onClick={() => dispatch(logout())} className="mr-8 ">
                  Logout{" "}
                </Button>
              </div>
            )}
          </span>
        </nav>
      )}
    </>
  );
};

export { Navbar };
