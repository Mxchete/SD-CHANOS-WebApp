import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Sidebar.css";

export default function Sidebar({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="sidebar-overlay"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="sidebar"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween" }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
