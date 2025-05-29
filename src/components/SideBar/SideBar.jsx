import React from "react";
import "./SideBar.css";
import avatar from "../../assets/avatar.svg";

function SideBar({ onEditProfile, onLogout }) {
  return (
    <div className="sidebar">
      <div className="sidebar__user-info">
        <img src={avatar} alt="User avatar" className="sidebar__avatar" />
        <h2 className="sidebar__name">Terrence Tegegne</h2>
      </div>
      <div className="sidebar__buttons">
        <button className="sidebar__button" onClick={onEditProfile}>
          Change profile data
        </button>
        <button className="sidebar__button" onClick={onLogout}>
          Log out
        </button>
      </div>
    </div>
  );
}

export default SideBar;
