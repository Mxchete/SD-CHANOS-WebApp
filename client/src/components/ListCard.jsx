import React, { useState, useRef, useEffect } from "react";
import "../global.css";
import "./ListCard.css";
import genericImage from "../assets/generic_image.svg";
import { FiEdit2 } from "react-icons/fi";

export default function ListCard({
  title,
  subtitle,
  image,
  buttonLabel,
  onButtonClick,
  onTitleChange,
  onImageClick,
  onImageSelect,
  children,
  forceRegular = false,
  forceExpanded = false,
  editable = false,
  extraStyles = "",
}) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");
  const [editingTitle, setEditingTitle] = useState(false);
  const [localTitle, setLocalTitle] = useState(title);
  const [localImage, setLocalImage] = useState(image);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  useEffect(() => {
    setLocalImage(image);
  }, [image]);

  useEffect(() => {
    if (expanded) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [expanded]);

  const handleCardClick = () => {
    if (!forceRegular) setExpanded((prev) => !prev);
  };

  const handleTitleBlur = () => {
    setEditingTitle(false);
    if (!localTitle.trim()) {
      setLocalTitle(title);
    } else if (onTitleChange) {
      onTitleChange(localTitle.trim());
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setLocalImage(previewURL);
      if (onImageSelect) onImageSelect(file);
    }
  };

  const name = `list-card ${expanded ? "expanded" : ""} ${
        forceRegular ? "regular-card" : ""
      } ${editable ? "editable-card" : ""} ${extraStyles}`.trim();

  return (
    <div
      className={name}
      onClick={handleCardClick}
    >
      <div className="card-header">
        <div className="card-info">
          <div className="card-icon-wrapper">
            {localImage !== "null" && (
              <img
                src={localImage || genericImage}
                alt=""
                className="card-icon"
              />
            )}
            {editable && (
              <div
                className="icon-overlay"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <FiEdit2 size={18} />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>

          <div className="title-wrapper">
            {editable && editingTitle ? (
              <div className="editable-title-container">
                <input
                  className="card-title-edit"
                  value={localTitle}
                  autoFocus
                  onChange={(e) => setLocalTitle(e.target.value)}
                  onBlur={handleTitleBlur}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleTitleBlur();
                  }}
                />
                <FiEdit2 size={16} className="input-edit-icon" />
              </div>
            ) : (
              <h3
                className="card-title"
                onClick={(e) => {
                  if (editable) {
                    e.stopPropagation();
                    setEditingTitle(true);
                  }
                }}
              >
                {localTitle}
              </h3>
            )}
            <p className="card-subtitle">{subtitle}</p>
          </div>
        </div>

        <div className="flex-spacer" />
        {buttonLabel && (
          <button
            className="card-button"
            onClick={(e) => {
              e.stopPropagation();
              if (onButtonClick) onButtonClick();
            }}
          >
            {buttonLabel}
          </button>
        )}
      </div>

      <div
        ref={contentRef}
        className="card-content"
        style={{ maxHeight: forceExpanded ? "none" : height }}
      >
        <div className="card-content-inner">{children}</div>
      </div>
    </div>
  );
}

