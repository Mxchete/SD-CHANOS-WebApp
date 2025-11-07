import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ListCard from "./ListCard";
import PlantList from "./PlantList";
import "../global.css";
import "./PotOverview.css";
import { updatePot, uploadPotImage, getPotImageUrl } from "../api";

const FocusedPot = ({ focusedPot, plants, onClose, onSave, setIsRefreshPaused }) => {
  const [editedTitle, setEditedTitle] = useState("");
  const [editedImageFile, setEditedImageFile] = useState(null);
  useEffect(() => {
    if (focusedPot) {
      setEditedTitle(focusedPot.name || "");
    }
  }, [focusedPot]);

  useEffect(() => {
    if (focusedPot) {
      setIsRefreshPaused(true);
    }
  }, [focusedPot]);

  const handleSave = async () => {
    try {
      await updatePot(focusedPot.id, { name: editedTitle });

      if (editedImageFile) {
        const formData = new FormData();
        formData.append("image", editedImageFile);
        await uploadPotImage(focusedPot.id, formData);
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
            onTitleChange={(title) => setEditedTitle(title)}
            onImageSelect={(file) => setEditedImageFile(file)}
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
              <div className="list">
                <PlantList plants={plants} />
              </div>
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

