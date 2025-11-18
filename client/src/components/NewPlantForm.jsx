import React, { useState, useEffect } from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import "../global.css";
import "./ListCard.css";
import "./PlantList.css";
import "./NewPlantForm.css";
import { addPlant, getUserPlants } from "../api";

dayjs.extend(duration);

function TimeInput({ label, fieldPrefix, formData, setFormData, extraStyle = "", fields = ["Days", "Hours", "Minutes"] }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIncrement = (name) => {
    setFormData((prev) => ({ ...prev, [name]: Number(prev[name] || 0) + 1 }));
  };

  const handleDecrement = (name) => {
    setFormData((prev) => ({ ...prev, [name]: Math.max(0, Number(prev[name] || 0) - 1) }));
  };

  return (
    <div className="form-row">
      <label className="form-label">{label}</label>
      <div className="time-inputs">
        {fields.map((unit) => {
          const name = `${fieldPrefix}${unit}`;
          return (
            <div key={name} className={`form-input time-input-wrapper ${extraStyle}`}>
              <input
                type="number"
                placeholder={unit}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="card-button"
                min={0}
              />
              <div className="custom-arrows">
                <button type="button" onClick={() => handleIncrement(name)}>
                  <FiChevronUp />
                </button>
                <button type="button" onClick={() => handleDecrement(name)}>
                  <FiChevronDown />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function NewPlantForm({ userUuid, onPlantsUpdated, formShown, parentPlant = null }) {
  const [formData, setFormData] = useState({
    name: "",
    samplingPeriodDays: "",
    samplingPeriodHours: "",
    samplingPeriodMinutes: "",
    wateringMilliliters: "",
    smv: "",
    maxSunlightDays: "",
    maxSunlightHours: "",
    maxSunlightMinutes: "",
  });

  const [loading, setLoading] = useState(false);

  // As a percent (i.e. 80 is 80%)
  const smvOptions = [
    { value: 80, label: "Wet" },
    { value: 65, label: "Moist" },
    { value: 30, label: "Damp" },
    { value: 20, label: "Dry" },
  ];

  useEffect(() => {
    if (parentPlant) {
      setFormData({
        name: parentPlant.name || "",
        samplingPeriodDays: parentPlant.sampling_period_days || 0,
        samplingPeriodHours: parentPlant.sampling_period_hours || 0,
        samplingPeriodMinutes: parentPlant.sampling_period_minutes || 0,
        wateringMilliliters: (100 * (parentPlant.watering_timer_useconds / 60 / 1_000_000 / 1.5)) || 0,
        smv: parentPlant.smv_percentage ? parentPlant.smv_percentage * 100 : "",
        maxSunlightDays: parentPlant.max_sunlight_days || 0,
        maxSunlightHours: parentPlant.max_sunlight_hours || 0,
        maxSunlightMinutes: parentPlant.max_sunlight_minutes || 0,
      });
    }
  }, [parentPlant]);

  const convertToMs = ({ days = 0, hours = 0, minutes = 0, seconds = 0 }) => {
    return dayjs.duration({ days, hours, minutes, seconds }).asMilliseconds();
  };

  const convertToUs = ({ days = 0, hours = 0, minutes = 0, seconds = 0 }) => {
    return convertToMs({ days, hours, minutes, seconds }) * 1000;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSMVSelect = (value) => {
    setFormData((prev) => ({ ...prev, smv: value }));
  };

  const handleAddPlant = async (e) => {
    e.preventDefault();

    const {
      name,
      smv,
      samplingPeriodDays,
      samplingPeriodHours,
      samplingPeriodMinutes,
      wateringMilliliters,
      maxSunlightDays,
      maxSunlightHours,
      maxSunlightMinutes,
    } = formData;

    setLoading(true);

    const samplingPeriodTotal = convertToUs({
      days: Number(samplingPeriodDays || 0),
      hours: Number(samplingPeriodHours || 0),
      minutes: Number(samplingPeriodMinutes || 0),
    });

    const maxSunlightTotal = dayjs
      .duration({
        days: Number(maxSunlightDays || 0),
        hours: Number(maxSunlightHours || 0),
        minutes: Number(maxSunlightMinutes || 0),
      })
      .asMinutes();

    if (!name || !smv || !wateringMilliliters || !samplingPeriodTotal || !maxSunlightTotal) {
      alert("Please fill all required fields.");
      setLoading(false);
      return;
    }

    const dataToSend = {
      user_id: userUuid,
      name,
      watering_timer_useconds: Math.round(((wateringMilliliters / 100) * 1.5) * 60 * 1_000_000),
      sampling_period: samplingPeriodTotal,
      sampling_period_minutes: Number(samplingPeriodMinutes || 0),
      sampling_period_hours: Number(samplingPeriodHours || 0),
      sampling_period_days: Number(samplingPeriodDays || 0),
      smv_percentage: Number(smv / 100),
      maximum_sunlight: maxSunlightTotal,
      max_sunlight_minutes: Number(maxSunlightMinutes || 0),
      max_sunlight_hours: Number(maxSunlightHours || 0),
      max_sunlight_days: Number(maxSunlightDays || 0),
    };

    if (parentPlant?.id) {
      dataToSend.parent_id = parentPlant.id;
    }

    const newPlant = await addPlant(dataToSend);

    if (newPlant) {
      const updatedPlants = await getUserPlants(userUuid);
      onPlantsUpdated(updatedPlants || []);
      setFormData({
        name: "",
        samplingPeriodDays: "",
        samplingPeriodHours: "",
        samplingPeriodMinutes: "",
        wateringMilliliters: "",
        smv: "",
        maxSunlightDays: "",
        maxSunlightHours: "",
        maxSunlightMinutes: "",
      });
    }

    setLoading(false);
    formShown(false);
  };

  return (
    <form className="new-plant-form" onSubmit={handleAddPlant}>
      <div className="form-row">
        <label className="form-label">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="card-button"
        />
      </div>

      <TimeInput
        label="Amount to Water (mL)"
        fieldPrefix="watering"
        formData={formData}
        setFormData={setFormData}
        fields={["Milliliters"]}
        extraStyle="time-input-large"
      />

      <TimeInput
        label="Time Between Watering"
        fieldPrefix="samplingPeriod"
        formData={formData}
        setFormData={setFormData}
      />

      <TimeInput
        label="Max Time In Sunlight"
        fieldPrefix="maxSunlight"
        formData={formData}
        setFormData={setFormData}
      />

      <div className="form-row">
        <label className="form-label">Preferred Soil Moisture</label>
        <div className="right-content smv-selector">
          {smvOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`smv-option ${formData.smv === option.value ? "selected" : ""}`}
              onClick={() => handleSMVSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className="card-button add-plant" disabled={loading}>
        {loading ? "Adding..." : parentPlant ? "Clone Plant" : "Add Plant"}
      </button>
    </form>
  );
}
