import React, { useEffect } from "react";
import "./Sidebar.css";
import LineStyleOutlinedIcon from "@mui/icons-material/LineStyleOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import PersonOutlineSharpIcon from "@mui/icons-material/PersonOutlineSharp";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import DynamicFeedOutlinedIcon from "@mui/icons-material/DynamicFeedOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import ReportIcon from "@mui/icons-material/Report";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLi, setActiveLi] = useState(null);

  const pathName = location.pathname.split("/")[1];

  useEffect(() => {
    if (pathName === "") {
      setActiveLi("li1");
    } else if (pathName === "users" || pathName === "user") {
      setActiveLi("li4");
    } else if (pathName === "products" || pathName === "product") {
      setActiveLi("li5");
    } else if (pathName === "orders" || pathName === "order") {
      setActiveLi("li6");
    }
  }, [pathName]);

  const handleLiClick = (liId, link) => {
    setActiveLi(liId);
    navigate(link);
  };

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <li
              onClick={() => handleLiClick("li1", "/")}
              className={`sidebarListItem ${
                activeLi === "li1" ? "active" : ""
              }`}
            >
              <LineStyleOutlinedIcon className="sidebarIcon"></LineStyleOutlinedIcon>
              Home
            </li>
            <li className="sidebarListItem inactive-feature tooltip">
              <TimelineOutlinedIcon className="sidebarIcon"></TimelineOutlinedIcon>
              Analytics
              <span class="tooltiptext">Coming Soon!</span>
            </li>
            <li className="sidebarListItem inactive-feature tooltip">
              <TrendingUpOutlinedIcon className="sidebarIcon"></TrendingUpOutlinedIcon>
              Sales
              <span class="tooltiptext">Coming Soon!</span>
            </li>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Quick Menu</h3>
          <ul className="sidebarList">
            <li
              onClick={() => handleLiClick("li4", "/users")}
              className={`sidebarListItem ${
                activeLi === "li4" ? "active" : ""
              }`}
            >
              <PersonOutlineSharpIcon className="sidebarIcon"></PersonOutlineSharpIcon>
              Users
            </li>
            <li
              onClick={() => handleLiClick("li5", "/products")}
              className={`sidebarListItem ${
                activeLi === "li5" ? "active" : ""
              }`}
            >
              <StorefrontOutlinedIcon className="sidebarIcon"></StorefrontOutlinedIcon>
              Products
            </li>
            <li
              onClick={() => handleLiClick("li6", "/orders")}
              className={`sidebarListItem ${
                activeLi === "li6" ? "active" : ""
              }`}
            >
              <AttachMoneyOutlinedIcon className="sidebarIcon"></AttachMoneyOutlinedIcon>
              Transactions
            </li>
            <li
              className={`inactive-feature tooltip sidebarListItem ${
                activeLi === "li7" ? "active" : ""
              }`}
            >
              <BarChartOutlinedIcon className="sidebarIcon"></BarChartOutlinedIcon>
              Reports
              <span class="tooltiptext">Coming Soon!</span>
            </li>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Notifications</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem inactive-feature tooltip">
              <MailOutlinedIcon className="sidebarIcon"></MailOutlinedIcon>
              Mail
              <span class="tooltiptext">Coming Soon!</span>
            </li>
            <li className="sidebarListItem inactive-feature tooltip">
              <DynamicFeedOutlinedIcon className="sidebarIcon"></DynamicFeedOutlinedIcon>
              Feedback
              <span class="tooltiptext">Coming Soon!</span>
            </li>
            <li className="sidebarListItem inactive-feature tooltip">
              <ChatBubbleOutlineOutlinedIcon className="sidebarIcon"></ChatBubbleOutlineOutlinedIcon>
              Messages
              <span class="tooltiptext">Coming Soon!</span>
            </li>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Staff</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem inactive-feature tooltip">
              <WorkOutlineOutlinedIcon className="sidebarIcon"></WorkOutlineOutlinedIcon>
              Manage
              <span class="tooltiptext">Coming Soon!</span>
            </li>
            <li className="sidebarListItem inactive-feature tooltip">
              <TimelineOutlinedIcon className="sidebarIcon"></TimelineOutlinedIcon>
              Analytics
              <span class="tooltiptext">Coming Soon!</span>
            </li>
            <li className="sidebarListItem inactive-feature tooltip">
              <ReportIcon className="sidebarIcon"></ReportIcon>
              Reports
              <span class="tooltiptext">Coming Soon!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
