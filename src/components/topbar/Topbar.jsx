import React from "react";
import "./Topbar.css";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

export default function Topbar() {
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">TRENDS.</span>
        </div>
        <div className="topRight">
          <div className="topbarIconContainer">
            <NotificationsNoneOutlinedIcon></NotificationsNoneOutlinedIcon>
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <LanguageOutlinedIcon></LanguageOutlinedIcon>
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <SettingsOutlinedIcon></SettingsOutlinedIcon>
          </div>
          <img src="https://images.pexels.com/photos/1526814/pexels-photo-1526814.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt="" className="topAvatar" />
        </div>
      </div>
    </div>
  );
}
