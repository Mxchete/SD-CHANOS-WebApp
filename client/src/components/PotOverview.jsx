import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPots, getPlant } from '../api';

const PotOverview = () => {
  const [pots, setPots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPot, setExpandedPot] = useState(null);
  const navigate = useNavigate();

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

  const handleUpdateClick = () => {
    navigate(`/plant/${expandedPot.id}`);
  }

  const handleHomeClick = () => {
    navigate('/');
  };

  const handlePlantClick = () => {
    const element = document.getElementById("add_plant");
    if(element.style.display == "none") {
      document.getElementById("add_plant").style.display = "inline-block";
      document.getElementById("view_plant").style.display = "inline-block";
    }
    else {
      document.getElementById("add_plant").style.display = "none";
      document.getElementById("view_plant").style.display = "none";
    }
  };

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading pots...</p>;
  }

  return (
    <div style={styles.parent}>
      <div style={styles.toolbar}>
        <h1>Toolbar</h1>
        <button type="button" style={styles.toolbarButton} onClick={() => handleHomeClick()}>
          Home
        </button>
        <button type="button" style={styles.toolbarButton} onClick={() => handlePlantClick()}>
          Plants
        </button>
        <button type="button" style={styles.toolbarPlantButton} id="add_plant">Add Plant</button>
        <button type="button" style={styles.toolbarPlantButton} id="view_plant">View Plants</button>
        <button type="button" style={styles.toolbarButton} >Account</button>
        <button type="button" style={styles.toolbarButton} >About</button>
        <button type="button" style={styles.toolbarButton} >Videos</button>
      </div>

    <div style={{ textAlign: 'center', marginTop: '30px', backgroundColor: '#202023', flex: '1' }}>
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
            <p>Battery Level: {expandedPot.battery_level}</p>
            <p>Current Soil Moisture Value: {expandedPot.current_moisture_level}</p>
            <p>Lux: {expandedPot.lux_value}</p>
            <p>Total Sunlight: {expandedPot.total_sunlight}</p>
            <p>
              {expandedPot.water_level_is_low
                ? '!!! Needs Water !!!'
                : 'Water level is good'}
            </p>

            <button style={styles.updateButton} onClick={handleUpdateClick}>
              Update Plant Information
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

const styles = {
  parent: {
    display: 'flex',
    //justifyContent: 'space-around',
    //alignItems: 'flex-start',
    //border: '1px solid #ccc',
    //padding: '10px',
    position: 'absolute',
    top: '0', right: '0', bottom: '0', left: '0',
  },
  toolbar: {
    display: 'inline-flex',
    flexDirection: 'column',
    //flex: '1', /* Allows divs to grow and shrink proportionally */
    justifyContent: 'left',
    padding: '15px',
    width: '250px',
    //border: '1px solid #eee',
    margin: '5px',
    backgroundColor: '#28282B'
  },
  toolbarButton: {
    backgroundColor: '#2E2E32',
    fontSize: '25px',
    fontWeight: 'bolder',
  },
  toolbarPlantButton: {
    display: 'none',
    backgroundColor: '#3E3E42',
    textAlign: 'right',
    fontSize: '20px',
    fontWeight: 'bold',
  },
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
  updateButton: {
    marginTop: '30px',
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#4A90E2',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
};

export default PotOverview;

