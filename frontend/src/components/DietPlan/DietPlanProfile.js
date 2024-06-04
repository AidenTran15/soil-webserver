// src/components/DietPlan/DietPlanProfile.js
import React, { useState } from 'react';
import Select from 'react-select';
import './DietPlanProfile.css';

const DietPlanProfile = ({ onSaveProfile }) => {
  const [profile, setProfile] = useState({
    age: '',
    weight: '',
    height: '',
    activityLevel: '',
    dietaryPreferences: '',
    healthGoals: ''
  });

  const dietaryOptions = [
    { value: 'GlutenFree', label: 'Gluten free and coeliac' },
    { value: 'DairyFree', label: 'Dairy free and lactose free' },
    { value: 'Vegetarian', label: 'Vegetarian' },
    { value: 'Vegan', label: 'Vegan' },
    { value: 'Paleo', label: 'Paleo' },
  ];

  const healthGoalsOptions = [
    { value: 'weight loss', label: 'weight loss' },
    { value: 'muscle gain', label: 'muscle gain' },
    { value: 'overall health improvement', label: 'overall health improvement' },
    { value: 'EnhancedMotivation', label: 'Enhanced Motivation' }
  ];

  const handleMultiChange = (option, actionMeta) => {
    setProfile(prev => ({ ...prev, [actionMeta.name]: option }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert selected options to simple arrays of values before saving if needed
    const saveProfile = {
      ...profile,
      dietaryPreferences: profile.dietaryPreferences.map(opt => opt.value),
      healthGoals: profile.healthGoals.map(opt => opt.value)
    };
    onSaveProfile(saveProfile);
  };

  return (
    <div className="diet-plan-profile-container">
    <h2 className="form-title">Diet Plan Profile</h2>
      <form onSubmit={handleSubmit} className="diet-plan-form">
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input type="number" id="age" name="age" placeholder="Age" value={profile.age} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="weight">Weight (kg)</label>
          <input type="number" id="weight" name="weight" placeholder="Weight (kg)" value={profile.weight} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="height">Height (cm)</label>
          <input type="number" id="height" name="height" placeholder="Height (cm)" value={profile.height} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="activityLevel">Activity Level</label>
          <select id="activityLevel" name="activityLevel" value={profile.activityLevel} onChange={handleChange} required>
            <option value="">Select an activity level</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dietaryPreferences">Dietary Preferences</label>
          <Select
            id="dietaryPreferences"
            name="dietaryPreferences"
            options={dietaryOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            isMulti
            onChange={handleMultiChange}
            value={profile.dietaryPreferences}
          />
        </div>
        <div className="form-group">
          <label htmlFor="healthGoals">Health Goals</label>
          <Select
            id="healthGoals"
            name="healthGoals"
            options={healthGoalsOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            isMulti
            onChange={handleMultiChange}
            value={profile.healthGoals}
          />
        </div>
        <button type="submit" className="save-profile-btn">Save Profile</button>
      </form>
    </div>
  );
};

export default DietPlanProfile;
