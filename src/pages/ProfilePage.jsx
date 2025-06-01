import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Edit3, Target, BarChart2, Save, Image as ImageIcon, AlertCircle, CheckCircle, LogOut } from 'lucide-react';

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
        } else throw new Error('Failed to create user');
      } else {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });

          if (!response.ok) throw new Error('Failed to update user');
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
    if (!window.confirm('Are you sure you want to delete your profile? This action can not be undone.')) return;

    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${userId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete user');
      }

      localStorage.clear();
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
    <div className="mb-4">
      <label className="block font-medium text-brown-700">{label}:</label>
      <input
        type={type}
        value={userData[section][field]}
        onChange={(e) => handleChange(section, field, e.target.value)}
        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 ${
          (field === 'email' && emailError) || fieldErrors[field] ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {(field === 'email' && emailError) && <p className="text-red-500 text-sm">{emailError}</p>}
      {fieldErrors[field] && <p className="text-red-500 text-sm">{fieldErrors[field]}</p>}
    </div>
  );

  const renderBasicProfile = () => (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-pink-700">Basic Profile Details</h2>
      <div className="mb-4">
        <img
          src={userData.profile.photo || '/default-profile.png'}
          alt="Profile"
          className="w-24 h-24 object-cover rounded-full border border-brown-300"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="mt-2 text-sm text-gray-600"
        />
      </div>
      {renderInput('Name', 'profile', 'name')}
      {renderInput('Email', 'profile', 'email')}
      {renderInput('Age', 'profile', 'age', 'number')}
      {renderInput('Gender', 'profile', 'gender')}
      {renderInput('Height (cm)', 'profile', 'height', 'number')}
      {renderInput('Weight (kg)', 'profile', 'weight', 'number')}
      {renderInput('Fitness Level', 'profile', 'fitnessLevel')}
      <p className="text-sm font-medium mt-2">BMI: <span className="text-gray-700">{calculateBMI(userData.profile.weight, userData.profile.height)}</span></p>
    </div>
  );

  const renderGoalsPreferences = () => (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-pink-700">Goals & Preferences</h2>
      {renderInput('Current Goal', 'goals', 'type')}
      {renderInput('Target', 'goals', 'target')}
      {renderInput('Timeframe', 'goals', 'timeframe')}
      {renderInput('Preferred Workouts', 'preferences', 'workouts')}
      {renderInput('Available Equipment', 'preferences', 'equipment')}
      {renderInput('Time Constraints', 'preferences', 'time')}
    </div>
  );

  const renderProgressAnalytics = () => (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-pink-700">Progress Tracking</h2>
      <h3 className="text-lg font-medium text-brown-600">Body Metrics Dashboard</h3>
      {renderInput('Recent Weight', 'progress', 'weight', 'number')}
      {renderInput('Body Measurements', 'progress', 'bodyMeasurements')}
      <h3 className="text-lg font-medium text-brown-600 mt-4">Workout Statistics</h3>
      {renderInput('Total Workouts Completed', 'progress', 'totalWorkouts', 'number')}
      {renderInput('Current Streak', 'progress', 'streak', 'number')}
      {renderInput('Favorite Exercises', 'progress', 'favoriteExercises')}
      {renderInput('Most Active Days/Times', 'progress', 'activeDaysTimes')}
      {renderInput('Calories Burned (est.)', 'progress', 'caloriesBurned', 'number')}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8 text-brown-800">
      <h1 className="text-2xl font-bold mb-2">User Profile {isDirty && <span className="text-red-500 text-base ml-2">(Unsaved Changes)</span>}</h1>

      <div className="flex space-x-2 mb-6">
        <button onClick={() => setActiveTab('basic')} className={`px-4 py-2 rounded-md ${activeTab === 'basic' ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-700'}`}>Basic</button>
        <button onClick={() => setActiveTab('goals')} className={`px-4 py-2 rounded-md ${activeTab === 'goals' ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-700'}`}>Goals & Preferences</button>
        <button onClick={() => setActiveTab('progress')} className={`px-4 py-2 rounded-md ${activeTab === 'progress' ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-700'}`}>Progress</button>
      </div>

      {activeTab === 'basic' && renderBasicProfile()}
      {activeTab === 'goals' && renderGoalsPreferences()}
      {activeTab === 'progress' && renderProgressAnalytics()}

      <div className="flex flex-wrap gap-4 mt-8">
        <button
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-md disabled:opacity-50"
          onClick={handleSave}
          disabled={emailError !== '' || Object.values(fieldErrors).some(Boolean)}
        >
          Save
        </button>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
          onClick={() => navigate('/settings')}
        >
          Back to Settings
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          onClick={handleDelete}
        >
          Delete Profile
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
