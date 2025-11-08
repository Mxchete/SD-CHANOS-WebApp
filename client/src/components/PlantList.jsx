import React, { useState, useEffect } from "react";
import ListCard from "./ListCard";
import { getUserPlants, addPlant } from "../api";
import "../global.css";
import "./ListCard.css";
import "./PlantList.css";

const PlantList = ({ plants, userUuid, onSelectPlant, selectedPlantUuid }) => {
  const [plantList, setPlantList] = useState(plants || []);

  const [formData, setFormData] = useState({
    name: "",
    wateringTimer: "",
    samplingPeriod: "",
    smv: "",
    maxSunlight: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPlantList(plants || []);
  }, [plants]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPlant = async () => {
    const { name, wateringTimer, samplingPeriod, smv, maxSunlight } = formData;
    if (!name || !wateringTimer || !samplingPeriod || !smv || !maxSunlight) {
      alert("Please fill all fields before submitting.");
      return;
    }

    setLoading(true);

    const dataToSend = {
      user_id: userUuid,
      name,
      watering_timer_useconds: Number(wateringTimer) * 60 * 1_000_000,
      sampling_period: Number(samplingPeriod) * 60 * 1_000_000,
      smv_percentage: Number(smv),
      maximum_sunlight: Number(maxSunlight),
    };

    const newPlant = await addPlant(dataToSend);
    if (newPlant) {
      const updatedPlants = await getUserPlants(userUuid);
      setPlantList(updatedPlants || []);

      setFormData({
        name: "",
        wateringTimer: "",
        samplingPeriod: "",
        smv: "",
        maxSunlight: "",
      });
      setShowForm(false);
    }

    setLoading(false);
  };

  return (
    <div className="plant-list">
      <h3>Available Plants</h3>
      <div className="list card-content">
        {plantList.map((plant) => (
          <ListCard
            key={plant.id}
            title={plant.name}
            subtitle={""}
            image="null"
            buttonLabel="Select"
            onButtonClick={() => onSelectPlant(plant.id)}
            extraStyles={selectedPlantUuid === plant.id ? "selected-plant" : ""}
          >
            <p>
              <strong>Sampling Period:</strong> {plant.sampling_period ?? "N/A"}
            </p>
          </ListCard>
        ))}

        <ListCard
          title="Add New Plant"
          subtitle={""}
          image="null"
          buttonLabel={showForm ? "Cancel" : "+"}
          onButtonClick={() => setShowForm((prev) => !prev)}
          forceExpanded={showForm}
          forceRegular
        >
          {showForm && (
            <form
              className="new-plant-form"
              style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "10px" }}
              onSubmit={(e) => {
                e.preventDefault();
                handleAddPlant();
              }}
            >
              {[
                { name: "name", label: "Name", type: "text" },
                { name: "wateringTimer", label: "Watering Timer (minutes)", type: "number" },
                { name: "samplingPeriod", label: "Sampling Period (minutes)", type: "number" },
                { name: "smv", label: "Soil Moisture Percentage", type: "number" },
                { name: "maxSunlight", label: "Max Sunlight Level", type: "number" },
              ].map((field) => (
                <label key={field.name} style={{ display: "flex", flexDirection: "column" }}>
                  {field.label}
                  <input
                    className="card-button"
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                    style={{ textAlign: "center" }}
                  />
                </label>
              ))}

              <button type="submit" className="card-button" disabled={loading}>
                {loading ? "Adding..." : "Add Plant"}
              </button>
            </form>
          )}
        </ListCard>
      </div>
    </div>
  );
};

export default PlantList;

