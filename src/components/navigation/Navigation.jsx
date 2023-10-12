import { Menu } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import {
  UserOutlined,
  CalendarOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <NavLink to={`/${key}`}>{label} </NavLink>,
  };
}

const items = [
  getItem("Coach", "coach", <UserOutlined />),
  getItem("Projects", "projects", <ProjectOutlined />),
  getItem("Calendar", "calendar", <CalendarOutlined />),
];

const Navigation = () => {
  const [selectedKey, setSelectedKey] = useState("coach");
  const { pathname } = useLocation();

  useEffect(() => {
    setSelectedKey(pathname.slice(1));
  }, [pathname]);

  return (
    <Menu
      className="bg-inherit text-inherit"
      // defaultSelectedKeys={["coach"]}
      // defaultOpenKeys={["sub1"]}
      selectedKeys={[selectedKey]}
      onClick={(item) => setSelectedKey(item.key)}
      // mode={"inline"}
      theme={"light"}
      items={items}
    />
  );
};

export { Navigation };
