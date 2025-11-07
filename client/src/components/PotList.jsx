import React from "react";
import { motion } from "framer-motion";
import ListCard from "./ListCard";
import { getPotImageUrl } from "../api";

const PotList = ({ pots, focusedPot, buttonClick }) => {
  const isAvailable = (item) => (!item ? "N/A" : item);

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
              <p>Battery Level: {isAvailable(pot.battery_level)}</p>
              <p>Current Soil Moisture Value: {isAvailable(pot.current_moisture_level)}</p>
              <p>Lux: {isAvailable(pot.lux_value)}</p>
              <p>Total Sunlight: {isAvailable(pot.total_sunlight)}</p>
              <p>{isAvailable(pot.water_level_is_low)}</p>
            </ListCard>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PotList;

