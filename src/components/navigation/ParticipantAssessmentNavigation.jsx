
import { Badge, Menu } from "antd";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: key.startsWith("header") ? (
      <>{label}</>
    ) : (
      <NavLink className="inline-flex gap-4" to={`/${key}`}>
        {label}
      </NavLink>
    ),
  };
}


const keysInitials = [
  "participant/assessments",
  "participant/results",
];




const ParticipantAssessmentNavigation = () => {
  const [selectedKey, setSelectedKey] = useState("assessments");
  const { pathname } = useLocation();
  const dispatch = useDispatch();


  useEffect(() => {
    let pathExists = false;
    keysInitials.forEach((key) => {
      if (pathname === `/${key}`) {
        setSelectedKey(key);
        pathExists = true;
      }
    });


    if (!pathExists) {
      setSelectedKey(null);
    }


  }, [pathname, dispatch]);


  
  const items = [
    getItem(
      "Shared Assessments",
      "participant/assessments",
      // <DashboardOutlinedIcon className="!text-[24px]" />
    ),
    getItem(
      "Result",
      "participant/results",
      // <DashboardOutlinedIcon className="!text-[24px]" />
    ),
  
  ];
 

  return (
    <Menu
      style={{
        border: 0,
        background: "inherit",
        color: "inherit",
      }}
      selectedKeys={[selectedKey]}
      onClick={(item) => setSelectedKey(item.key)}
      mode={"inline"}
      theme={"light"}
      items={items}
    />
  );
};

export { ParticipantAssessmentNavigation };
