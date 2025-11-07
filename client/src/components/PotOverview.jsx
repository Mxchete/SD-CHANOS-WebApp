import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  getUserPots,
  getPlant,
  getUserPlants,
  getUserProfile,
} from "../api";
import FocusedPot from "./FocusedPot";
import PotList from "./PotList";
import "../global.css";

const PotOverview = () => {
  const [pots, setPots] = useState([]);
  const [plants, setPlants] = useState([]);
  const [user, setUser] = useState(null);
  const [focusedPot, setFocusedPot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshPaused, setIsRefreshPaused] = useState(false);

  const fetchPots = useCallback(async () => {
    const potsData = await getUserPots();
    if (!potsData) {
      setPots([]);
      return [];
    }

    const potsWithPlants = await Promise.all(
      potsData.map(async (pot) => {
        let plantName = "None";
        if (pot.plant_id) {
          try {
            const plant = await getPlant(pot.plant_id);
            plantName = plant?.name || "Unknown Plant";
          } catch {
            plantName = "Unknown Plant";
          }
        }
        return { ...pot, plantName };
      })
    );

    setPots([...potsWithPlants]);
    return potsWithPlants;
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      const [userData, plantsData] = await Promise.all([
        getUserProfile(),
        getUserPlants(),
      ]);
      if (userData) setUser(userData);
      if (plantsData) setPlants(plantsData);

      await fetchPots();
      setLoading(false);
    };

    fetchAll();

    const interval = setInterval(async () => {
      if (!focusedPot) {
        await fetchPots();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchPots, isRefreshPaused]);

  const handleButtonClick = (pot) => setFocusedPot(pot);
  const handleCloseFocus = () => setFocusedPot(null);

  const handleSaveAndRefresh = async () => {
    const updatedPots = await fetchPots();

    if (focusedPot) {
      const updated = updatedPots.find((p) => p.id === focusedPot.id);
      if (updated) {
        setFocusedPot({ ...updated });
      }
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;
  }

  return (
    <div className="list-container">
      <motion.h2
        className="section-title"
        layout
        animate={{
          y: focusedPot ? -40 : 0,
          opacity: focusedPot ? 0.6 : 1,
          scale: focusedPot ? 0.9 : 1,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        Welcome, {user?.given_name}
      </motion.h2>

      <FocusedPot
        focusedPot={focusedPot}
        plants={plants}
        onClose={() => {handleCloseFocus(); setIsRefreshPaused(false);}}
        onSave={handleSaveAndRefresh}
        setIsRefreshPaused={setIsRefreshPaused}
      />

      <PotList
        key={pots.map(p => p.id).join(",")}
        pots={pots}
        focusedPot={focusedPot}
        buttonClick={handleButtonClick}
      />
    </div>
  );
};

export default PotOverview;

