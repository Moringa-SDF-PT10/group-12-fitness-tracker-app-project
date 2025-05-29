import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');

  const defaultProfileData = {
    name: 'Desmond Voyage',
    email: 'voyage@example.com',
    age: 30,
    gender: 'Male',
    height: 175,
    weight: 70,
    fitnessLevel: 'Intermediate',
    profilePhoto: '',
    goalType: 'Weight Loss',
    goalTarget: 'Lose 5 kg',
    goalTimeframe: '3 months',
    preferredWorkouts: 'Cardio, Strength',
    availableEquipment: 'Dumbbells, Treadmill',
    timeConstraints: '45 minutes/day',
    recentWeight: 70,
    bodyMeasurements: 'Chest: 95cm, Waist: 85cm, Hips: 70cm',
    totalWorkouts: 45,
    streak: 10,
    favoriteExercises: 'Push-ups, Squats',
    activeDaysTimes: 'Mon/Wed/Fri - Morning',
    caloriesBurned: 12000,
  };

  const [userData, setProfileData] = useState(() => {
    const storedData = localStorage.getItem('userData');
    return storedData ? JSON.parse(storedData) : defaultProfileData;
  });
   const [emailError, setEmailError] = useState('');

  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
  }, [userData]);

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return '-';
    const heightInMeters = parseFloat(height) / 100;
    const bmi = parseFloat(weight) / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedData = { ...userData, profilePhoto: reader.result };
        localStorage.setItem('userData', JSON.stringify(updatedData));
        setProfileData(updatedData);
      };
      reader.readAsDataURL(file);
    }
  };

  
  const handleChange = (field, value) => {
  setProfileData(prev => ({ ...prev, [field]: value }));

  // Validate email
  if (field === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  }
};


  const handleSave = () => {
    localStorage.setItem('userData', JSON.stringify(userData));
    alert('Profile updated successfully.');
  };

  const renderBasicProfile = () => (
    <div className="profile-section">
      <h2>Basic Profile Details</h2>
      <img
        src={userData.profilePhoto || '/default-profile.png'}
        alt="Profile"
        className="profile-photo"
      />
      <input type="file" accept="image/*" onChange={handlePhotoUpload} />
      <p><strong>Name:</strong> <input value={userData.name} onChange={e => handleChange('name', e.target.value)} /></p>
      <p><strong>Email:</strong> <input value={userData.email}onChange={e => handleChange('email', e.target.value)}className={emailError ? 'input-error' : ''}/>
          {emailError && <span className="error-text">{emailError}</span>}
      </p>
      <p><strong>Age:</strong> <input type="number" value={userData.age} onChange={e => handleChange('age', e.target.value)} /></p>
      <p><strong>Gender:</strong> <input value={userData.gender} onChange={e => handleChange('gender', e.target.value)} /></p>
      <p><strong>Height (cm):</strong> <input type="number" value={userData.height} onChange={e => handleChange('height', e.target.value)} /></p>
      <p><strong>Weight (kg):</strong> <input type="number" value={userData.weight} onChange={e => handleChange('weight', e.target.value)} /></p>
      <p><strong>Fitness Level:</strong> <input value={userData.fitnessLevel} onChange={e => handleChange('fitnessLevel', e.target.value)} /></p>
      <p><strong>BMI:</strong> {calculateBMI(userData.weight, userData.height)}</p>
    </div>
  );

  const renderGoalsPreferences = () => (
    <div className="profile-section">
      <h2>Goals & Preferences</h2>
      <p><strong>Current Goal:</strong> <input value={userData.goalType} onChange={e => handleChange('goalType', e.target.value)} /></p>
      <p><strong>Target:</strong> <input value={userData.goalTarget} onChange={e => handleChange('goalTarget', e.target.value)} /></p>
      <p><strong>Timeframe:</strong> <input value={userData.goalTimeframe} onChange={e => handleChange('goalTimeframe', e.target.value)} /></p>
      <p><strong>Preferred Workouts:</strong> <input value={userData.preferredWorkouts} onChange={e => handleChange('preferredWorkouts', e.target.value)} /></p>
      <p><strong>Available Equipment:</strong> <input value={userData.availableEquipment} onChange={e => handleChange('availableEquipment', e.target.value)} /></p>
      <p><strong>Time Constraints:</strong> <input value={userData.timeConstraints} onChange={e => handleChange('timeConstraints', e.target.value)} /></p>
    </div>
  );

  const renderProgressAnalytics = () => (
    <div className="profile-section">
      <h2>Progress Tracking & Analytics</h2>
      <h3>Body Metrics Dashboard</h3>
      <p><strong>Recent Weight:</strong> <input type="number" value={userData.recentWeight} onChange={e => handleChange('recentWeight', e.target.value)} /></p>
      <p><strong>Body Measurements:</strong> <input value={userData.bodyMeasurements} onChange={e => handleChange('bodyMeasurements', e.target.value)} /></p>
      
      <h3>Workout Statistics</h3>
      <p><strong>Total Workouts Completed:</strong> <input type="number" value={userData.totalWorkouts} onChange={e => handleChange('totalWorkouts', e.target.value)} /></p>
      <p><strong>Current Streak:</strong> <input type="number" value={userData.streak} onChange={e => handleChange('streak', e.target.value)} /></p>
      <p><strong>Favorite Exercises:</strong> <input value={userData.favoriteExercises} onChange={e => handleChange('favoriteExercises', e.target.value)} /></p>
      <p><strong>Most Active Days/Times:</strong> <input value={userData.activeDaysTimes} onChange={e => handleChange('activeDaysTimes', e.target.value)} /></p>
      <p><strong>Calories Burned (est.):</strong> <input type="number" value={userData.caloriesBurned} onChange={e => handleChange('caloriesBurned', e.target.value)} /></p>
    </div>
  );

  return (
    <div className="profile-page">
      <h1>User Profile</h1>

      {/* Tabs Navigation */}
      <div className="tabs">
        <button onClick={() => setActiveTab('basic')} className={activeTab === 'basic' ? 'active' : ''}>Basic</button>
        <button onClick={() => setActiveTab('goals')} className={activeTab === 'goals' ? 'active' : ''}>Goals & Preferences</button>
        <button onClick={() => setActiveTab('progress')} className={activeTab === 'progress' ? 'active' : ''}>Progress & Analytics</button>
      </div>

      {/* Conditional Tab Content */}
      {activeTab === 'basic' && renderBasicProfile()}
      {activeTab === 'goals' && renderGoalsPreferences()}
      {activeTab === 'progress' && renderProgressAnalytics()}

      <div className="profile-actions">
        {/* disable save button incase of invalid email address */}
        <button className="btn btn-save" onClick={handleSave} disabled={emailError !== ''}>Save</button>
        <button className="btn btn-back" onClick={() => navigate('/settings')}>Back to Settings</button>
      </div>
    </div>
  );
};

export default ProfilePage;
