import React from "react";
import { useNavigate } from "react-router-dom";
import "../global.css";
import "./NotificationPanel.css";
import ListCard from "./ListCard";

export default function UserMenuPanel({ user, onLogout }) {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      if (onLogout) await onLogout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const menuItems = [
    { id: "home", title: "Home", onClick: () => handleNavigate("/overview") },
    { id: "account", title: "Account", onClick: () => handleNavigate("/account") },
    { id: "logout", title: "Logout", onClick: handleLogout },
  ];

  return (
    <div className="list card-content">
      <ListCard
        title={`User Menu`}
        image="null"
        extraStyles="notifications-container"
        onTitleChange={() => {}}
        editable={false}
        onButtonClick={null}
        forceExpanded={true}
        extraStyles={"no-hover"}
      >
        {menuItems.map((item) => (
          <ListCard
            key={item.id}
            title={null}
            image="null"
            editable={false}
            forceRegular={true}
            extraStyles="notif-item"
            forceExpanded={false}
            buttonLabel={item.title}
            onButtonClick={item.onClick}
            extraStyles={"no-hover plant-card"}
          >
            <button
              className="menu-button"
              onClick={item.onClick}
            >
              {item.title}
            </button>
          </ListCard>
        ))}
      </ListCard>
    </div>
  );
}
