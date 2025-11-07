import React, { useState, useEffect } from "react";
import { getUserProfile } from "../api";
import "./ProfileIcon.css";

export default function UserProfileIcon() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserProfile();
      if (data) setUser(data);
    };
    fetchUser();
  }, []);

  const handleClick = () => {
    console.log("User icon clicked!");
  };

  if (!user) return null;

  return (
    <div className="user-profile-icon" onClick={handleClick}>
      <img
        src={user.picture_url}
        alt={user.name}
        className="user-profile-avatar"
      />
    </div>
  );
}
