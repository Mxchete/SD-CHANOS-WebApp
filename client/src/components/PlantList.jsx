import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import ListCard from "./ListCard";
import NewPlantForm from "./NewPlantForm";
import { getUserPlants } from "../api";
import "../global.css";
import "./ListCard.css";
import "./PlantList.css";

dayjs.extend(duration);

const PlantList = ({ plants, userUuid, onSelectPlant, selectedPlantUuid }) => {
  const [plantList, setPlantList] = useState(plants || []);
  const [showForm, setShowForm] = useState(false);
  const [parentPlant, setParentPlant] = useState(null);

  const formatTime = (microseconds) => {
    const ms = Number(microseconds) / 1000;
    const dur = dayjs.duration(ms);

    const days = dur.days();
    const hours = dur.hours();
    const minutes = dur.minutes();

    const parts = [];
    if (days) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
    if (hours) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
    if (minutes || parts.length === 0) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);

    return parts.join(", ");
  };

  const getPrefSMV = (smv_percent) => {
    const smv = Math.round(smv_percent * 100);
    if (smv >= 80) return "Wet";
    if (smv >= 65) return "Moist";
    if (smv >= 30) return "Damp";
    return "Dry";
  };

  useEffect(() => {
    setPlantList(plants || []);
  }, [plants]);

  const toggleCloneForm = (plant) => {
    if (parentPlant && parentPlant.id === plant.id) {
      setParentPlant(null);
    } else {
      setParentPlant(plant);
    }
  };

  return (
    <div className="plant-list">
      <h3>Available Plants</h3>
      <div className="list card-content">
        {plantList.map((plant) => (
          <ListCard
            key={plant.id}
            title={plant.name}
            subtitle=""
            image="null"
            buttonLabel="Select"
            onButtonClick={() => onSelectPlant(plant.id)}
            forceExpanded={parentPlant !== null && parentPlant.id === plant.id}
            forceRegular={parentPlant !== null && parentPlant.id === plant.id}
            extraStyles={selectedPlantUuid === plant.id ? "selected-plant" : ""}
          >
            <p><strong>Water With:</strong> {`${Math.round(100 * (plant.watering_timer_useconds / 60 / 1_000_000 / 1.5))} mL`}</p>
            <p><strong>Sampling Period:</strong> {`${plant.sampling_period_days} day(s), ${plant.sampling_period_hours} hour(s), ${plant.sampling_period_minutes} minute(s)`}</p>
            <p><strong>Maximum Time in the Sun:</strong> {`${plant.max_sunlight_days} day(s), ${plant.max_sunlight_hours} hour(s), ${plant.max_sunlight_minutes} minute(s)`}</p>
            <p><strong>Prefers:</strong> {`${getPrefSMV(plant.smv_percentage)} Soil`}</p>

            <button
              className="card-button clone-button"
              type="button"
              onClick={() => toggleCloneForm(plant)}
              style={{ marginTop: "8px" }}
            >
              {parentPlant && parentPlant.id === plant.id ? "Cancel" : "Clone Plant"}
            </button>

            <AnimatePresence mode="wait">
              {(parentPlant !== null && (plant.id === parentPlant.id)) && (
                <motion.div
                  key="newPlantForm"
                  initial={{ height: 0, opacity: 0, y: -10 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <NewPlantForm
                    userUuid={userUuid}
                    onPlantsUpdated={setPlantList}
                    formShown={setParentPlant}
                    parentPlant={parentPlant}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </ListCard>
        ))}

        <ListCard
          title="Add New Plant"
          subtitle=""
          image="null"
          buttonLabel={showForm ? "Cancel" : "+"}
          onButtonClick={() => {
            setParentPlant(null);
            setShowForm((prev) => !prev);
          }}
          forceExpanded={showForm}
          forceRegular
          extraStyles={"no-hover plant-card"}
        >
          <AnimatePresence mode="wait">
            {showForm && (
              <motion.div
                key="newPlantForm"
                initial={{ height: 0, opacity: 0, y: -10 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <NewPlantForm
                  userUuid={userUuid}
                  onPlantsUpdated={setPlantList}
                  formShown={setShowForm}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </ListCard>
      </div>
    </div>
  );
};

export default PlantList;

