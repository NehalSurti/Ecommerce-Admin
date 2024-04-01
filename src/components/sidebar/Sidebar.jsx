import React from "react";
import "./Sidebar.css";
import LineStyleOutlinedIcon from "@mui/icons-material/LineStyleOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import PersonOutlineSharpIcon from '@mui/icons-material/PersonOutlineSharp';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import DynamicFeedOutlinedIcon from '@mui/icons-material/DynamicFeedOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import ReportIcon from '@mui/icons-material/Report';
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <li onClick={()=>navigate('/')} className="sidebarListItem active">
              <LineStyleOutlinedIcon className="sidebarIcon"></LineStyleOutlinedIcon>
              Home
            </li>
            <li className="sidebarListItem">
              <TimelineOutlinedIcon className="sidebarIcon"></TimelineOutlinedIcon>
              Analytics
            </li>
            <li className="sidebarListItem">
              <TrendingUpOutlinedIcon className="sidebarIcon"></TrendingUpOutlinedIcon>
              Sales
            </li>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Quick Menu</h3>
          <ul className="sidebarList">
            <li onClick={()=>navigate('/users')} className="sidebarListItem active">
              <PersonOutlineSharpIcon className="sidebarIcon"></PersonOutlineSharpIcon>
              Users
            </li>
            <li onClick={()=>navigate('/products')} className="sidebarListItem">
              <StorefrontOutlinedIcon className="sidebarIcon"></StorefrontOutlinedIcon>
              Products
            </li>
            <li className="sidebarListItem">
              <AttachMoneyOutlinedIcon className="sidebarIcon"></AttachMoneyOutlinedIcon>
              Transactions
            </li>
            <li className="sidebarListItem">
              <BarChartOutlinedIcon className="sidebarIcon"></BarChartOutlinedIcon>
              Reports
            </li>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Notifications</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem active">
              <MailOutlinedIcon className="sidebarIcon"></MailOutlinedIcon>
              Mail
            </li>
            <li className="sidebarListItem">
              <DynamicFeedOutlinedIcon className="sidebarIcon"></DynamicFeedOutlinedIcon>
              Feedback
            </li>
            <li className="sidebarListItem">
              <ChatBubbleOutlineOutlinedIcon className="sidebarIcon"></ChatBubbleOutlineOutlinedIcon>
              Messages
            </li>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Staff</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem active">
              <WorkOutlineOutlinedIcon className="sidebarIcon"></WorkOutlineOutlinedIcon>
              Manage
            </li>
            <li className="sidebarListItem">
              <TimelineOutlinedIcon className="sidebarIcon"></TimelineOutlinedIcon>
              Analytics
            </li>
            <li className="sidebarListItem">
              <ReportIcon className="sidebarIcon"></ReportIcon>
              Reports
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
