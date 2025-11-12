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
    if (smv >= 80) {
      return "Wet";
    }
    else if (smv >= 65) {
      return "Moist";
    }
    else if (smv >= 35) {
      return "Damp";
    }
    else {
      return "Dry";
    }
  }

  useEffect(() => {
    setPlantList(plants || []);
  }, [plants]);

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
            extraStyles={selectedPlantUuid === plant.id ? "selected-plant" : ""}
          >
            <p><strong>Water With:</strong> {`${100 * (plant.watering_timer_useconds / 60 / 1_000_000 / 1.5)} mL of Water` ?? "N/A"}</p>
            <p><strong>Sampling Period:</strong> {(plant.sampling_period === null) ? "N/A" : `${plant.sampling_period_days} day(s), ${plant.sampling_period_hours} hour(s), and ${plant.sampling_period_minutes} minute(s)`}</p>
            <p><strong>Maximum Time in the Sun:</strong> {(plant.max_sunlight === null) ? "N/A" : `${plant.max_sunlight_days} day(s), ${plant.max_sunlight_hours} hour(s), and ${plant.max_sunlight_minutes} minute(s)`}</p>
            <p><strong>Prefers:</strong> {`${getPrefSMV(plant.smv_percentage)} Soil`}</p>
          </ListCard>
        ))}

        <ListCard
          title="Add New Plant"
          subtitle=""
          image="null"
          buttonLabel={showForm ? "Cancel" : "+"}
          onButtonClick={() => setShowForm((prev) => !prev)}
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

