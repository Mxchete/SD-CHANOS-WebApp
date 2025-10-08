import React, { useEffect, useState } from 'react';
import { getAllPots, getPlant } from '../api';

const PotOverview = () => {
  const [pots, setPots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPot, setExpandedPot] = useState(null);

  useEffect(() => {
    const fetchPots = async () => {
      const potsData = await getAllPots();

      if (potsData && potsData.length > 0) {
        const potsWithPlants = await Promise.all(
          potsData.map(async (pot) => {
            if (pot.plant_id) {
              try {
                const plant = await getPlant(pot.plant_id);
                return { ...pot, plantName: plant?.name || 'Unknown Plant' };
              } catch {
                return { ...pot, plantName: 'Unknown Plant' };
              }
            } else {
              return { ...pot, plantName: 'None' };
            }
          })
        );
        setPots(potsWithPlants);
      }

      setLoading(false);
    };

    fetchPots();
  }, []);

  const handleCardClick = (pot) => {
    setExpandedPot(pot);
  };

  const handleClose = () => {
    setExpandedPot(null);
  };

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading pots...</p>;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <h1>Pot Overview</h1>
      {!expandedPot ? (
        <div style={styles.potGrid}>
          {pots.length > 0 ? (
            pots.map((pot) => (
              <div
                key={pot.id}
                style={styles.potCard}
                onClick={() => handleCardClick(pot)}
              >
                <h3 style={styles.uuidText}>{pot.id}</h3>
                <p style={styles.plantText}>Plant: {pot.plantName}</p>
              </div>
            ))
          ) : (
            <p>No pots found.</p>
          )}
        </div>
      ) : (
        <div style={styles.expandedContainer}>
          <div style={styles.expandedCard}>
            <button style={styles.closeButton} onClick={handleClose}>
              ✕
            </button>
            <h2>Pot Details</h2>
            <p><strong>Pot ID:</strong> {expandedPot.id}</p>
            <p><strong>Plant:</strong> {expandedPot.plantName}</p>
            <p>More data coming soon...</p>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  potGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
    padding: '20px',
    transition: 'opacity 0.3s ease',
  },
  potCard: {
    borderRadius: '12px',
    padding: '20px',
    width: '220px',
    backgroundColor: '#2E2E32',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    color: '#E3E3E3',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
  },
  uuidText: {
    marginBottom: '8px',
  },
  plantText: {
    color: '#B8B8BB',
    fontSize: '0.95rem',
  },
  expandedContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '70vh',
    transition: 'all 0.3s ease',
  },
  expandedCard: {
    position: 'relative',
    width: '80%',
    maxWidth: '800px',
    minHeight: '400px',
    backgroundColor: '#2E2E32',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    padding: '40px',
    textAlign: 'left',
    color: '#E3E3E3',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  closeButton: {
    borderRadius: '64px',
    position: 'absolute',
    top: '16px',
    right: '16px',
    border: 'none',
    background: '#343339',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#E3E3E3',
  },
};

export default PotOverview;

