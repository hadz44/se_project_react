import React from "react";
import "./Profile.css";
import SideBar from "../SideBar/SideBar";
import ClothesSection from "../ClothesSection/ClothesSection";

function Profile({
  clothingItems,
  onAddClick,
  onCardClick,
  onEditProfile,
  onLogout,
  weatherType,
  onSelectCard,
  isLoggedIn,
}) {
  return (
    <div className="profile">
      <SideBar onEditProfile={onEditProfile} onLogout={onLogout} />
      <div className="profile__content">
        <ClothesSection
          clothingItems={clothingItems}
          handleAddClick={onAddClick}
          onCardClick={onCardClick}
          weatherType={weatherType}
          onSelectCard={onSelectCard}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  );
}

export default Profile;
