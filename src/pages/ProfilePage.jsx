import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isNonNegativeNumber = (value) => typeof value === 'number' && !isNaN(value) && value >= 0;

const defaultUserData = {
  profile: {
    name: '',
    email: '',
    age: '',
    gender: 'Male',
    height: '',
    weight: '',
    photo: '',
    fitnessLevel: 'Intermediate',
  },
  goals: {
    type: 'Weight Loss',
    target: 'Lose 20 kg',
    timeframe: '8 Weeks',
  },
  preferences: {
    workouts: '',
    equipment: '',
    time: '',
  },
  progress: {
    weight: '',
    bodyMeasurements: '',
    totalWorkouts: '',
    streak: '',
    favoriteExercises: '',
    activeDaysTimes: '',
    caloriesBurned: '',
  },
  notifications: {
    notifyWorkouts: true,
    notifyProgress: true,
  },
  appearance: {
    theme: 'light',
    fontSize: 'medium',
  },
  subscription: {
    plan: 'Free',
  },
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [isDirty, setIsDirty] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [userCreated, setUserCreated] = useState(localStorage.getItem('userCreated') === 'true');

  const [userData, setUserData] = useState(() => {
    const stored = localStorage.getItem('userData');
    const parsed = stored ? JSON.parse(stored) : {};
    return {
      ...defaultUserData,
      ...parsed,
      profile: { ...defaultUserData.profile, ...parsed.profile },
      goals: { ...defaultUserData.goals, ...parsed.goals },
      preferences: { ...defaultUserData.preferences, ...parsed.preferences },
      progress: { ...defaultUserData.progress, ...parsed.progress },
      notifications: { ...defaultUserData.notifications, ...parsed.notifications },
      appearance: { ...defaultUserData.appearance, ...parsed.appearance },
      subscription: { ...defaultUserData.subscription, ...parsed.subscription },
    };
  });

  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
  }, [userData]);

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return '-';
    const heightM = parseFloat(height) / 100;
    const bmi = parseFloat(weight) / (heightM * heightM);
    return bmi.toFixed(1);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({
          ...prev,
          profile: { ...prev.profile, photo: reader.result },
        }));
        setIsDirty(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (section, field, value) => {
    const numericFields = ['age', 'height', 'weight', 'totalWorkouts', 'streak', 'caloriesBurned'];
    const parsedValue = numericFields.includes(field) ? parseFloat(value) || '' : value;

    setUserData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: parsedValue,
      },
    }));
    setIsDirty(true);

    if (field === 'email') {
      setEmailError(validateEmail(value) ? '' : 'Please enter a valid email address.');
    }

    if (numericFields.includes(field)) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: isNonNegativeNumber(parsedValue) ? '' : 'Value must be 0 or greater.',
      }));
    }
  };

  const handleSave = async () => {
    try {
      if (!userCreated) {
        // Create user
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('userCreated', 'true');
          localStorage.setItem('userId', data.id);
          setUserCreated(true);
        } else {
          throw new Error('Failed to create user');
        }
      } else {
        // Update user
        const userId = localStorage.getItem('userId');
        if (userId) {
          const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });

          if (!response.ok) {
            throw new Error('Failed to update user');
          }
        }
      }

      localStorage.setItem('userData', JSON.stringify(userData));
      setIsDirty(false);
      alert('Profile saved successfully.');
    } catch (error) {
      console.error('Save error:', error);
      alert('An error occurred while saving your profile.');
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your profile? This action can not be undone.');
    if (!confirmDelete) return;

    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${userId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }
      }

      localStorage.removeItem('userCreated');
      localStorage.removeItem('userId');
      localStorage.removeItem('userData');
      setUserCreated(false);
      setUserData(defaultUserData);
      setIsDirty(false);
      alert('Profile deleted successfully.');
    } catch (error) {
      console.error('Delete error:', error);
      alert('An error occurred while deleting your profile.');
    }
  };

  const renderInput = (label, section, field, type = 'text') => (
    <p>
      <strong>{label}:</strong>
      <input
        type={type}
        value={userData[section][field]}
        onChange={(e) => handleChange(section, field, e.target.value)}
        className={(field === 'email' && emailError) || fieldErrors[field] ? 'input-error' : ''}
      />
      {field === 'email' && emailError && <span className="error-text">{emailError}</span>}
      {fieldErrors[field] && <span className="error-text">{fieldErrors[field]}</span>}
    </p>
  );

  const renderBasicProfile = () => (
    <div className="profile-section">
      <h2>Basic Profile Details</h2>
      <img
        src={userData.profile.photo || '/default-profile.png'}
        alt="Profile"
        className="profile-photo"
      />
      <input type="file" accept="image/*" onChange={handlePhotoUpload} />
      {renderInput('Name', 'profile', 'name')}
      {renderInput('Email', 'profile', 'email')}
      {renderInput('Age', 'profile', 'age', 'number')}
      {renderInput('Gender', 'profile', 'gender')}
      {renderInput('Height (cm)', 'profile', 'height', 'number')}
      {renderInput('Weight (kg)', 'profile', 'weight', 'number')}
      {renderInput('Fitness Level', 'profile', 'fitnessLevel')}
      <p><strong>BMI:</strong> {calculateBMI(userData.profile.weight, userData.profile.height)}</p>
    </div>
  );

  const renderGoalsPreferences = () => (
    <div className="profile-section">
      <h2>Goals & Preferences</h2>
      {renderInput('Current Goal', 'goals', 'type')}
      {renderInput('Target', 'goals', 'target')}
      {renderInput('Timeframe', 'goals', 'timeframe')}
      {renderInput('Preferred Workouts', 'preferences', 'workouts')}
      {renderInput('Available Equipment', 'preferences', 'equipment')}
      {renderInput('Time Constraints', 'preferences', 'timeConstraints')}
    </div>
  );

  const renderProgressAnalytics = () => (
    <div className="profile-section">
      <h2>Progress Tracking & Analytics</h2>
      <h3>Body Metrics Dashboard</h3>
      {renderInput('Recent Weight', 'progress', 'weight', 'number')}
      {renderInput('Body Measurements', 'progress', 'bodyMeasurements')}
      <h3>Workout Statistics</h3>
      {renderInput('Total Workouts Completed', 'progress', 'totalWorkouts', 'number')}
      {renderInput('Current Streak', 'progress', 'streak', 'number')}
      {renderInput('Favorite Exercises', 'progress', 'favoriteExercises')}
      {renderInput('Most Active Days/Times', 'progress', 'activeDaysTimes')}
      {renderInput('Calories Burned (est.)', 'progress', 'caloriesBurned', 'number')}
    </div>
  );

  return (
    <div className="profile-page">
      <h1>User Profile {isDirty && <span className="unsaved">(Unsaved Changes)</span>}</h1>

      <div className="tabs">
        <button onClick={() => setActiveTab('basic')} className={activeTab === 'basic' ? 'active' : ''}>Basic</button>
        <button onClick={() => setActiveTab('goals')} className={activeTab === 'goals' ? 'active' : ''}>Goals & Preferences</button>
        <button onClick={() => setActiveTab('progress')} className={activeTab === 'progress' ? 'active' : ''}>Progress</button>
      </div>

      {activeTab === 'basic' && renderBasicProfile()}
      {activeTab === 'goals' && renderGoalsPreferences()}
      {activeTab === 'progress' && renderProgressAnalytics()}

      <div className="profile-actions">
        <button
          className="btn btn-save"
          onClick={handleSave}
          disabled={emailError !== '' || Object.values(fieldErrors).some(Boolean)}
        >
          Save
        </button>
        <button className="btn btn-back" onClick={() => navigate('/settings')}>
          Back to Settings
        </button>
        <button className="btn btn-delete" onClick={handleDelete}>
          Delete Profile
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;








