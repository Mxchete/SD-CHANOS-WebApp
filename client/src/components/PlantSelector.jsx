import React, { useEffect, useState } from 'react';
import { getAllPlants, addPlant } from '../api';

const PlantSelector = ({ onSelectPlant }) => {
  const [plants, setPlants] = useState([]);
  const [selectedPlantID, setSelectedPlantID] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newPlant, setNewPlant] = useState({
    name: '',
    watering_timer_useconds: '',
    sampling_period: '',
    maximum_moisture_level: '',
    minimum_moisture_level: '',
    smv_percentage: '',
    maximum_sunlight: '',
  });

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    const res = await getAllPlants();
    if (res) setPlants(res);
  };

  const handleSelect = (id) => {
    setSelectedPlantID(id);
    onSelectPlant(id);
  };

  const handleAddPlant = () => {
    setShowForm((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlant((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...newPlant,
      watering_timer_useconds: Number(newPlant.watering_timer_useconds),
      sampling_period: Number(newPlant.sampling_period),
      maximum_moisture_level: Number(newPlant.maximum_moisture_level),
      minimum_moisture_level: Number(newPlant.minimum_moisture_level),
      smv_percentage: Number(newPlant.smv_percentage),
      maximum_sunlight: Number(newPlant.maximum_sunlight),
    };

    const res = await addPlant(payload);
    if (res) {
      await fetchPlants();
      setShowForm(false);
      setNewPlant({
        name: '',
        watering_timer_useconds: '',
        sampling_period: '',
        maximum_moisture_level: '',
        minimum_moisture_level: '',
        smv_percentage: '',
        maximum_sunlight: '',
      });
    }
  };

  return (
    <div style={{ marginTop: '40px', color: '#E3E3E3', textAlign: 'center' }}>
      <h2>Available Plants</h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          marginTop: '20px',
        }}
      >
        {plants.length === 0 ? (
          <p>No plants found.</p>
        ) : (
          plants.map((plant) => (
            <div
              key={plant.id}
              onClick={() => handleSelect(plant.id)}
              style={{
                width: '300px',
                padding: '10px',
                borderRadius: '8px',
                border:
                  selectedPlantID === plant.id
                    ? '2px solid #4CAF50'
                    : '1px solid #666',
                backgroundColor:
                  selectedPlantID === plant.id ? '#2e2e2e' : '#1e1e1e',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <strong>{plant.name}</strong>
            </div>
          ))
        )}
      </div>

      <button
        onClick={handleAddPlant}
        style={{
          marginTop: '20px',
          width: '300px',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid #666',
          backgroundColor: '#1e1e1e',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        + Add Plant
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            marginTop: '20px',
            backgroundColor: '#2E2E32',
            padding: '20px',
            borderRadius: '12px',
            width: '320px',
            margin: '0 auto',
          }}
        >
          {[
            'name',
            'watering_timer_useconds',
            'sampling_period',
            'maximum_moisture_level',
            'minimum_moisture_level',
            'smv_percentage',
            'maximum_sunlight',
          ].map((field) => (
            <input
              key={field}
              type={field === 'name' ? 'text' : 'number'}
              name={field}
              value={newPlant[field]}
              onChange={handleInputChange}
              placeholder={field.replace(/_/g, ' ')}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #555',
                backgroundColor: '#1e1e1e',
                color: '#E3E3E3',
              }}
            />
          ))}

          <button
            type="submit"
            style={{
              marginTop: '10px',
              backgroundColor: '#2196F3',
              border: 'none',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Add Plant
          </button>
        </form>
      )}
    </div>
  );
};

export default PlantSelector;
