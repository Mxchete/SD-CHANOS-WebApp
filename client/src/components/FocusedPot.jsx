import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ListCard from "./ListCard";
import PlantList from "./PlantList";
import "../global.css";
import "./PotOverview.css";
import "./PlantList.css";
import { updatePot, uploadPotImage, getPotImageUrl, setPlantUUID } from "../api";

const FocusedPot = ({ focusedPot, plants, onClose, onSave, setIsRefreshPaused }) => {
  const [editedTitle, setEditedTitle] = useState("");
  const [editedImageFile, setEditedImageFile] = useState(null);
  const [selectedPlantUuid, setSelectedPlantUuid] = useState(focusedPot?.plant_id || null);

  useEffect(() => {
    if (focusedPot) setEditedTitle(focusedPot.name || "");
    if (focusedPot) setSelectedPlantUuid(focusedPot.plant_id || null);
  }, [focusedPot]);

  useEffect(() => {
    if (focusedPot) setIsRefreshPaused(true);
  }, [focusedPot]);

  const handleSave = async () => {
    try {
      await updatePot(focusedPot.id, { name: editedTitle });

      if (editedImageFile) {
        const formData = new FormData();
        formData.append("image", editedImageFile);
        await uploadPotImage(focusedPot.id, formData);
      }

      console.log(selectedPlantUuid);
      console.log(focusedPot.plant_id);
      if (selectedPlantUuid && selectedPlantUuid !== focusedPot.plant_id) {
        await setPlantUUID(focusedPot.id, { plant_uuid: selectedPlantUuid });
      }

      if (onSave) await onSave();

      onClose();
    } catch (err) {
      console.error("Failed to save pot changes:", err);
    }
  };

  return (
    <AnimatePresence mode="popLayout">
      {focusedPot && (
        <motion.div
          key={focusedPot.id}
          layoutId={`card-${focusedPot.id}`}
          className="focused-card no-hover always-expanded"
          transition={{ type: "spring", stiffness: 250, damping: 30 }}
        >
          <ListCard
            title={focusedPot.name}
            subtitle={focusedPot.plantName}
            image={getPotImageUrl(focusedPot.image_url) || null}
            editable
            onTitleChange={setEditedTitle}
            onImageSelect={setEditedImageFile}
            buttonLabel="Cancel"
            onButtonClick={onClose}
          />

          <AnimatePresence>
            <motion.div
              key={`plant-list-${focusedPot.id}`}
              className="list-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <PlantList
                plants={plants}
                userUuid={focusedPot.user_id}
                selectedPlantUuid={selectedPlantUuid}
                onSelectPlant={setSelectedPlantUuid}
              />
            </motion.div>
          </AnimatePresence>

          <button className="close-btn" onClick={handleSave}>
            Save
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FocusedPot;

