import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPot, getPlant, setPlantUUID } from '../api';
import PlantSelector from './PlantSelector';

const PlantPage = () => {
  const { potID } = useParams();
  const [pot, setPot] = useState(null);
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlantID, setSelectedPlantID] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPotAndPlant = async () => {
      try {
        console.log("getting pot");
        console.log(potID);
        const potRes = await getPot(potID);
        setPot(potRes);

        console.log("getting plant");
        if (potRes && potRes.plant_id) {
          const plantRes = await getPlant(potRes.plant_id);
          setPlant(plantRes);
        }
      } catch (error) {
        console.error('Error fetching pot or plant:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPotAndPlant();
  }, [potID]);

  const handleSelectPlant = (plantID) => {
    console.log(`selected: ${plantID}`)
    setSelectedPlantID(plantID);
  };

  const handleConfirmSelection = async () => {
    console.log(`Updating pot ${potID} to use plant ${selectedPlantID}`);
    await setPlantUUID(potID, {"plant_uuid":selectedPlantID});
    navigate(`/overview`);
  };

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading pot and plant info...</p>;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', color: '#E3E3E3' }}>
      <h1>Update Plant Information</h1>
      {pot ? (
        <>
          <p><strong>Pot ID:</strong> {pot.id}</p>
          {plant ? (
            <p><strong>Plant Name:</strong> {plant.name}</p>
          ) : (
            <p>No plant associated with this pot.</p>
          )}
        </>
      ) : (
        <p>Pot not found.</p>
      )}

      <PlantSelector onSelectPlant={handleSelectPlant} />

      {selectedPlantID && (
        <button
          onClick={handleConfirmSelection}
          style={{
            marginTop: '30px',
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Confirm Plant Selection
        </button>
      )}
    </div>
  );
};

export default PlantPage;

