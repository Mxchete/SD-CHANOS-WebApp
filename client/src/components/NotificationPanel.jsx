// Notifications attempt 2
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getUserNotifications } from "../api";
import "../global.css";
import "./NotificationPanel.css";
import ListCard from "./ListCard";

export default function NotificationsPanel({ user }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      const notifs = await getUserNotifications();
      setNotifications(notifs || []);
      setLoading(false);
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 120000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <p className="notif-loading">Loading notifications...</p>;
  }

  return (
    <div className="list card-content">
      <ListCard
        title={`Notifications (${notifications.length})`}
        image="null"
        extraStyles="notifications-container"
        onTitleChange={() => {}}
        editable={false}
        onButtonClick={null}
        onClick={() => setExpanded(!expanded)}
      >
        {notifications.length === 0 ? (
          <p className="notif-empty">No notifications</p>
        ) : (
          notifications.map((n) => (
            <ListCard
              key={n.id}
              title={n.header}
              subtitle={new Date(n.created_at).toLocaleString(undefined, {
                dateStyle: "short",
                timeStyle: "short",
              })}
              image="null"
              forceRegular={true}
              editable={false}
              extraStyles="notif-item"
              forceExpanded={true}
            >
              <p>{n.message}</p>
            </ListCard>
          ))
        )}
      </ListCard>
    </div>
  );
}

