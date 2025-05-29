import React, { useContext } from "react";
import "../Header/header.css";
import logo from "../../assets/logo.svg";
import avatar from "../../assets/avatar.svg";
import ToggleSwitch from "../ToggleSwitch/ToggleSwitch";
import { Link } from "react-router-dom";
import CurrentTemperatureUnitContext from "../../context/CurrentTemperatureUnitContext";

function Header({ handleAddClick, weatherData }) {
  const { currentTemperatureUnit, handleSwitchChange } = useContext(CurrentTemperatureUnitContext);

  const currentDate = new Date().toLocaleString("default", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <header className="header">
      <div className="header__left">
        <Link to="/" className="header__link">
          <img className="header__logo" src={logo} alt="Logo" />
        </Link>
        <Link to="/" className="header__link">
          <p className="header__date-and-location">
            {currentDate}, {weatherData?.city || "Unknown City"}
            {weatherData?.temp && ` ${weatherData.temp[currentTemperatureUnit]}°${currentTemperatureUnit}`}
          </p>
        </Link>
      </div>
      <div className="header__right">
        <ToggleSwitch 
          isChecked={currentTemperatureUnit === "F"} 
          onToggle={handleSwitchChange} 
        />
        <div className="header__actions">
          <button
            onClick={handleAddClick}
            type="button"
            className="header__button"
          >
            +Add clothes
          </button>
          <Link to="/profile" className="header__link header__link_type_profile">
            Profile
          </Link>
          <Link to="/profile" className="header__link">
            <div className="header__avatar-container">
              <p className="header__username">Terrence Tegegne</p>
              <img
                src={avatar}
                alt="Terrence Tegegne"
                className="header__avatar"
              />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
