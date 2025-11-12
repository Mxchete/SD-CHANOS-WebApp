import React, { useState, useEffect } from "react";
import { getUserProfile } from "../api";
import Sidebar from "./Sidebar";
import NotificationsPanel from "./NotificationPanel";
import UserMenuPanel from "./UserMenuPanel";
import "./ProfileIcon.css";

export default function UserProfileIcon() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const clearAuthToken = async () => {
    try {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    } catch (err) {
      console.error("Error clearing token:", err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserProfile();
      if (data) setUser(data);
    };
    fetchUser();
  }, []);

  const handleClick = () => setSidebarOpen(!sidebarOpen);
  const handleClose = () => setSidebarOpen(false);

  if (!user) return null;

  return (
    <>
      <div className="user-profile-icon" onClick={handleClick}>
        <img
          src={user.picture_url}
          alt={user.name}
          className="user-profile-avatar"
        />
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={handleClose}>
        <NotificationsPanel user={user} />
        {/* <UserMenuPanel user={user} onLogout={clearAuthToken} /> */}
      </Sidebar>
    </>
  );
}

