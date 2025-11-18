import React, { useEffect, useState } from "react";
import { getUserProfile } from "../api";
import dayjs from "dayjs";
import "../global.css";
import "./AccountPage.css";
import UserProfileIcon from "./ProfileIcon";
import default_picture from '../assets/default_picture.png';

export default function AccountPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="account-page">Loading...</div>;
  if (error) return <div className="account-page error">{error}</div>;

  const { email, name, picture_url, created_at, last_login_at } = profile;

  return (
    <div className="account-page">
      <UserProfileIcon />
      <h1>Account Details</h1>

      <div className="profile-picture-container">
        <img
          src={picture_url || default_picture}
          alt={name || "User"}
          className="account-picture"
        />
      </div>

      <div className="account-card">
        <div className="account-info">
          <p><strong>Name:</strong> {name || "N/A"}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Account Created:</strong> {dayjs(created_at).format("MMMM D, YYYY h:mm A")}</p>
          <p><strong>Last Login:</strong> {last_login_at ? dayjs(last_login_at).format("MMMM D, YYYY h:mm A") : "Never"}</p>
        </div>
      </div>
    </div>
  );
}

