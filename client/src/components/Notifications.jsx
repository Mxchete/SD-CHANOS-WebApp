import React, { useEffect, useState } from 'react';
import { getNotis } from '../api';

const Notifications = () => {
  const [notis, setNotis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotis = async () => {
      try {
        const data = await getNotis();
        if (data) setNotis(data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotis();
  }, []);

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading notifications...</p>;
  }

  if (notis.length === 0) {
    return null;
  }

  return (
    <div style={styles.container}>
      {notis.map((noti, index) => (
        <div key={index} style={styles.notiCard}>
          <h3 style={styles.notiHeader}>{noti.header}</h3>
          <p style={styles.notiMessage}>{noti.message}</p>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '30px auto 10px auto',
    gap: '12px',
    width: '100%',
    maxWidth: '1000px',
  },
  notiCard: {
    width: '100%',
    backgroundColor: '#33343A',
    borderRadius: '10px',
    padding: '16px 24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    color: '#E3E3E3',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  notiCardHover: {
    transform: 'scale(1.02)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
  },
  notiHeader: {
    margin: '0 0 8px 0',
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#FFFFFF',
  },
  notiMessage: {
    margin: 0,
    fontSize: '0.95rem',
    color: '#C9C9C9',
  },
};

export default Notifications;
