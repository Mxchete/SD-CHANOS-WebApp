import React, { useState } from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import "../global.css";
import "./ListCard.css";
import "./PlantList.css";
import "./NewPlantForm.css";
import { addPlant, getUserPlants } from "../api";

dayjs.extend(duration);

function TimeInput({ label, fieldPrefix, formData, setFormData, extraStyle="", fields = ["Days", "Hours", "Minutes"]}) {
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
            <div key={name} className={`form-input time-input-wrapper  ${extraStyle}`}>
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

export default function NewPlantForm({ userUuid, onPlantsUpdated }) {
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
    { value: 35, label: "Damp" },
    { value: 20, label: "Dry" },
  ];

  const convertToMs = ({ days = 0, hours = 0, minutes = 0, seconds = 0 }) => {
    const dur = dayjs.duration({
      days,
      hours,
      minutes,
      seconds,
    });
    return dur.asMilliseconds();
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

    const numSamplePeriodDays = Number(samplingPeriodDays || 0);
    const numSamplePeriodHours = Number(samplingPeriodHours || 0);
    const numSamplePeriodMinutes = Number(samplingPeriodMinutes || 0);

    const samplingPeriodTotal = convertToUs({
      days: numSamplePeriodDays,
      hours: numSamplePeriodHours,
      minutes: numSamplePeriodMinutes
    });

    const numMaxSunlightDays = Number(maxSunlightDays || 0);
    const numMaxSunlightHours = Number(maxSunlightHours || 0);
    const numMaxSunlightMinutes = Number(maxSunlightMinutes || 0);

    const maxSunlightTotal = convertToUs({
      days: numMaxSunlightDays,
      hours: numMaxSunlightHours,
      minutes: numMaxSunlightMinutes
    });

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
      sampling_period_minutes: numSamplePeriodMinutes,
      sampling_period_hours: numSamplePeriodHours,
      sampling_period_days: numSamplePeriodDays,
      smv_percentage: Number(smv / 100),
      maximum_sunlight: maxSunlightTotal,
      max_sunlight_minutes: numMaxSunlightMinutes,
      max_sunlight_hours: numMaxSunlightHours,
      max_sunlight_days: numMaxSunlightDays,
    };

    console.log(dataToSend);

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
        {loading ? "Adding..." : "Add Plant"}
      </button>
    </form>
  );
}

