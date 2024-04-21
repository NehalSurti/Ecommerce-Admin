import React from "react";
import "./Topbar.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/user/userSlice";
import { useNavigate } from "react-router-dom";
// import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
// import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
// import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

export default function Topbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);

  const handleClick = () => {
    try {
      dispatch(logout());
      navigate("/login");
    } catch (error) {}
  };

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">TRENDS.</span>
        </div>
        <div className="topRight">
          {/* <div className="topbarIconContainer">
            <NotificationsNoneOutlinedIcon></NotificationsNoneOutlinedIcon>
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <LanguageOutlinedIcon></LanguageOutlinedIcon>
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <SettingsOutlinedIcon></SettingsOutlinedIcon>
          </div> */}
          <div onClick={handleClick} className="logout">
            Logout
          </div>
          <img
            src={
              currentUser?.img ||
              "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif"
            }
            alt=""
            className="topAvatar"
          />
        </div>
      </div>
    </div>
  );
}
