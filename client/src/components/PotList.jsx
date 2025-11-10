import React from "react";
import { motion } from "framer-motion";
import ListCard from "./ListCard";
import { getPotImageUrl } from "../api";

const PotList = ({ pots, focusedPot, buttonClick }) => {
  const isAvailable = (item) => ((item === null) ? "N/A" : item);

  return (
    <div className="list">
      {pots.map((pot) => {
        return (
          <motion.div
            key={pot.id}
            layoutId={`card-${pot.id}`}
            transition={{ type: "spring", stiffness: 250, damping: 30 }}
            animate={{
              opacity: !focusedPot || focusedPot.id === pot.id ? 1 : 0,
              scale: !focusedPot || focusedPot.id === pot.id ? 1 : 0.5,
            }}
            style={{
              pointerEvents:
                focusedPot && focusedPot.id !== pot.id ? "none" : "auto",
            }}
          >
            <ListCard
              title={pot.name}
              subtitle={pot.plantName}
              image={getPotImageUrl(pot.image_url) || null}
              buttonLabel="Update Plant"
              onButtonClick={() => buttonClick(pot)}
            >
              <p><strong>Pot ID:</strong> {isAvailable(pot.id)}</p>
              <p><strong>Plant:</strong> {pot.plantName}</p>
              <p>Battery Level: {(pot.battery_level !== null) ? `${Math.round(((pot.battery_level - 6) * 100)/2.4)}%` : "N/A"}</p>
              <p>Current Soil Moisture Value: {isAvailable(pot.current_moisture_level)}</p>
              <p>Lux: {isAvailable(pot.lux_value)}</p>
              <p>Total Sunlight: {isAvailable(pot.total_sunlight)}</p>
              <p>{pot.water_level_is_low ? "Water level is low" : "Water level is good"}</p>
            </ListCard>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PotList;

