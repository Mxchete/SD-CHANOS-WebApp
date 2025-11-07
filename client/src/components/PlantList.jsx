import React from "react";
import ListCard from "./ListCard";
import "../global.css";
import "./ListCard.css";

const PlantList = ({ plants, className = "" }) => {
  if (!plants || plants.length === 0) {
    return (
     <div className={`plant-list ${className}`}> 
        <h3>Available Plants</h3>
        <p>No plants found.</p>
      </div>
    );
  }

  return (
   <div className={`plant-list ${className}`}> 
      <h3>Available Plants</h3>
      <div className={`list ${className} card-content`}>
        {plants.map((plant) => (
          <ListCard
            key={plant.id}
            title={plant.name}
            subtitle={""}
            image="null"
            buttonLabel="Select"
            onButtonClick={() => {
              console.log(`Selected plant: ${plant.name}`);
            }}
          >
            <p><strong>Sampling Period:</strong> {plant.sampling_period ?? "N/A"}</p>
          </ListCard>
        ))}
        <ListCard
          title={"Add New Plant"}
          subtitle={""}
          image="null"
          buttonLabel="+"
          onButtonClick={() => {
            console.log("New Plant");
          }}
          forceRegular
        >
        </ListCard>
      </div>
    </div>
  );
};

export default PlantList;

