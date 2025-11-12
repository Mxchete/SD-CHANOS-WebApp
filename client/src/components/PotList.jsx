import React from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import ListCard from "./ListCard";
import { getPotImageUrl } from "../api";

dayjs.extend(duration);

const PotList = ({ pots, focusedPot, buttonClick }) => {
  const isAvailable = (item) => ((item === null) ? "N/A" : item);

  const smvPercentageReadable = (smvNum, smvPercent) => {
    const wet = 1530.2288;
    const dry = 3173.3255;
    const thresh = dry - (dry - wet)*(smvPercent / 100);
    console.log(thresh);

    // smv below threshold means wet soil, smv above threshold should be watered
    if (smvNum > thresh) {
      return "Soil is too dry";
    }
    return "Soil is sufficiently wet";
  };

  const getLightLevel = (lux) => {
    if (lux >= 50000) {
      return "Very Bright";
    }
    else if (lux >= 30000) {
      return "Bright";
    }
    else if (lux >= 10000) {
      return "Overcast";
    }
    else if (lux >= 0) {
      return "Dark";
    }
    return "N/A";
  };

  const calcSunlight = (sunlightTime) => {
    const sunInMins = dayjs.duration({minutes: sunlightTime});
    
    const days = Math.floor(sunInMins.asDays());
    const hours = Math.floor(sunInMins.asHours()) % 24;
    const minutes = Math.floor(sunInMins.asMinutes()) % 60;

    return `${days} Day(s), ${hours} Hour(s), and ${minutes} Minute(s)`;
  };

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
              <p>Battery Level: {(pot.battery_level !== null) ? `${Math.round(((pot.battery_level - 6) * 100)/2.4)}% (${pot.charging_state > 1 ? "Charging" : "Discharging"})` : "N/A"}</p>
              <p>Current Soil Moisture Value: {(pot.current_moisture_level !== null && pot.plantSmv !== null) ? smvPercentageReadable(pot.current_moisture_level, pot.plantSmv) : "N/A"}</p>
              <p>Light Level: {pot.lux_value === null ? "N/A" : getLightLevel(Number(pot.lux_value))}</p>
              <p>Total Time in Sunlight: {pot.total_sunlight === null ? "N/A" : calcSunlight(Number(pot.total_sunlight))}</p>
              <p>{pot.water_level_is_low ? "Water level is low" : "Water level is good"}</p>
            </ListCard>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PotList;

