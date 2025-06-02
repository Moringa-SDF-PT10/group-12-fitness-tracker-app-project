import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Edit3, Target, BarChart2, Save, Image as ImageIcon, AlertCircle, CheckCircle, LogOut, Trash2 } from 'lucide-react'; // Added Trash2

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isNonNegativeNumber = (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0;
};


const defaultUserData = {
  profile: {
    name: '', email: '', age: '', gender: 'Male', height: '', weight: '',
    photo: '', fitnessLevel: 'Intermediate',
  },
  goals: { type: 'Weight Loss', target: 'Lose 20 kg', timeframe: '8 Weeks' },
  preferences: { workouts: '', equipment: '', time: '' },
  progress: {
    weight: '', bodyMeasurements: '', totalWorkouts: '', streak: '',
    favoriteExercises: '', activeDaysTimes: '', caloriesBurned: '',
  },
  notifications: { notifyWorkouts: true, notifyProgress: true },
  appearance: { theme: 'light', fontSize: 'medium' },
  subscription: { plan: 'Free' },
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [isDirty, setIsDirty] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [userCreated, setUserCreated] = useState(localStorage.getItem('userCreated') === 'true');
  const [saveMessage, setSaveMessage] = useState(''); 

  const [userData, setUserData] = useState(() => {
    const stored = localStorage.getItem('userData');
    try {
        const parsed = stored ? JSON.parse(stored) : {};
        return {
            profile: { ...defaultUserData.profile, ...parsed.profile },
            goals: { ...defaultUserData.goals, ...parsed.goals },
            preferences: { ...defaultUserData.preferences, ...parsed.preferences },
            progress: { ...defaultUserData.progress, ...parsed.progress },
            notifications: { ...defaultUserData.notifications, ...parsed.notifications },
            appearance: { ...defaultUserData.appearance, ...parsed.appearance },
            subscription: { ...defaultUserData.subscription, ...parsed.subscription },
        };
    } catch (e) {
        console.error("Failed to parse user data from localStorage", e);
        return defaultUserData;
    }
  });

  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
  }, [userData]);

  const calculateBMI = (weight, height) => {
    if (!weight || !height || parseFloat(height) === 0) return '-';
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    if (isNaN(weightNum) || isNaN(heightNum) || heightNum <=0 ) return '-';
    const heightM = heightNum / 100;
    const bmi = weightNum / (heightM * heightM);
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
    let parsedValue = value;
    if (numericFields.includes(field)) {
        parsedValue = value === '' ? '' : parseFloat(value); // Allow empty string, parse if not
    }
  
    setUserData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: parsedValue,
      },
    }));
    setIsDirty(true);
  
    if (field === 'email') {
      setEmailError(validateEmail(value) || value === '' ? '' : 'Please enter a valid email address.');
    }
  
    if (numericFields.includes(field) && value !== '') {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: isNonNegativeNumber(parsedValue) ? '' : 'Value must be 0 or greater.',
      }));
    } else if (numericFields.includes(field) && value === '') {
        setFieldErrors((prev) => ({ ...prev, [field]: '' })); // Clear error if field is emptied
    }
  };

  const handleSave = async () => {
    setSaveMessage('');
    // Validate all fields before saving
    let currentFieldErrors = {};
    if (!validateEmail(userData.profile.email) && userData.profile.email !== '') {
        currentFieldErrors.email = 'Please enter a valid email address.';
    }
    const numericFields = ['age', 'height', 'weight', 'totalWorkouts', 'streak', 'caloriesBurned'];
    numericFields.forEach(field => {
        const section = field === 'age' || field === 'height' || field === 'weight' ? 'profile' : 'progress';
        const value = userData[section][field];
        if (value !== '' && !isNonNegativeNumber(value)) {
            currentFieldErrors[field] = 'Value must be 0 or greater.';
        }
    });

    setFieldErrors(currentFieldErrors);
    if (Object.values(currentFieldErrors).some(Boolean) || (emailError && userData.profile.email !== '')) {
        setSaveMessage('Please correct the errors before saving.');
        setTimeout(() => setSaveMessage(''), 3000);
        return;
    }

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
        } else throw new Error('Failed to create user profile on server');
      } else {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${userId}`, {
            method: 'PATCH', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          });
          if (!response.ok) throw new Error('Failed to update user profile on server');
        }
      }
      localStorage.setItem('userData', JSON.stringify(userData));
      setIsDirty(false);
      setSaveMessage('Profile saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      setSaveMessage(`Error: ${error.message || 'Could not save profile.'}`);
    }
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) return;
    setSaveMessage('');
    try {
      const userId = localStorage.getItem('userId');
      if (userId && userCreated) { // Only attempt delete if user was "created" on mock server
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${userId}`, {
          method: 'DELETE',
        });
      }
      localStorage.removeItem('userData');
      localStorage.removeItem('userCreated');
      localStorage.removeItem('userId');
      setUserCreated(false);
      setUserData(defaultUserData); 
      setIsDirty(false);
      setSaveMessage('Profile deleted successfully.');
    } catch (error) {
      console.error('Delete error:', error);
      setSaveMessage(`Error: ${error.message || 'Could not delete profile.'}`);
    }
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const renderInput = (label, section, field, type = 'text') => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-[#6C757D] mb-1">{label}:</label>
      <input
        type={type}
        value={userData[section]?.[field] ?? ''}
        onChange={(e) => handleChange(section, field, e.target.value)}
        className={`w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 bg-white text-[#3E3E3E] placeholder-[#6C757D] transition-colors ${
          (field === 'email' && emailError && userData.profile.email !== '') || (fieldErrors[field] && userData[section]?.[field] !== '') ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-[#B0B0B0] focus:ring-[#05BFDB] focus:border-[#05BFDB]'
        }`}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
      {(field === 'email' && emailError && userData.profile.email !== '') && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
      {(fieldErrors[field] && userData[section]?.[field] !== '') && <p className="text-red-500 text-xs mt-1">{fieldErrors[field]}</p>}
    </div>
  );

  const renderSelect = (label, section, field, options) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-[#6C757D] mb-1">{label}:</label>
        <select
            value={userData[section]?.[field] ?? ''}
            onChange={(e) => handleChange(section, field, e.target.value)}
            className="w-full px-3 py-2.5 border border-[#B0B0B0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-white text-[#3E3E3E] transition-colors"
        >
            {options.map(opt => <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>)}
        </select>
    </div>
  );


  const renderBasicProfile = () => (
    <div className="p-1">
      <h2 className="text-xl font-semibold mb-6 text-[#0A4D68] flex items-center"><User className="w-6 h-6 mr-2 text-[#05BFDB]" />Basic Profile</h2>
      <div className="mb-6 text-center">
        <img
          src={userData.profile.photo || `https://placehold.co/120x120/E0E0E0/0B0B0B?text=${(userData.profile.name?.[0] || 'U').toUpperCase()}`}
          alt="Profile"
          className="w-28 h-28 object-cover rounded-full border-2 border-[#05BFDB] mx-auto mb-3"
        />
        <label htmlFor="photo-upload" className="cursor-pointer text-sm text-[#05BFDB] hover:text-[#049DB4] inline-flex items-center">
            <ImageIcon size={16} className="mr-1" /> Change Photo
        </label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />
      </div>
      {renderInput('Full Name', 'profile', 'name')}
      {renderInput('Email Address', 'profile', 'email', 'email')}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderInput('Age', 'profile', 'age', 'number')}
        {renderSelect('Gender', 'profile', 'gender', ['Male', 'Female', 'Other', 'Prefer not to say'])}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderInput('Height (cm)', 'profile', 'height', 'number')}
        {renderInput('Weight (kg)', 'profile', 'weight', 'number')}
      </div>
      <p className="text-sm font-medium mt-3 text-[#3E3E3E]">Calculated BMI: <span className="font-bold text-[#0A4D68]">{calculateBMI(userData.profile.weight, userData.profile.height)}</span></p>
      {renderSelect('Fitness Level', 'profile', 'fitnessLevel', ['Beginner', 'Intermediate', 'Advanced', 'Expert'])}
    </div>
  );

  const renderGoalsPreferences = () => (
    <div className="p-1">
      <h2 className="text-xl font-semibold mb-6 text-[#0A4D68] flex items-center"><Target className="w-6 h-6 mr-2 text-[#05BFDB]" />Goals & Preferences</h2>
      {renderSelect('Primary Goal', 'goals', 'type', ['Weight Loss', 'Muscle Gain', 'Improve Endurance', 'Maintain Fitness', 'Learn New Skills'])}
      {renderInput('Specific Target (e.g., Lose 5kg, Run 5k)', 'goals', 'target')}
      {renderInput('Desired Timeframe (e.g., 3 Months, By December)', 'goals', 'timeframe')}
      
      <h3 className="text-lg font-medium text-[#0A4D68] mt-6 mb-3">Workout Preferences</h3>
      {renderInput('Preferred Workout Types (e.g., Cardio, Strength, Yoga)', 'preferences', 'workouts')}
      {renderInput('Available Equipment (e.g., Dumbbells, Resistance Bands, None)', 'preferences', 'equipment')}
      {renderInput('Preferred Workout Times / Constraints', 'preferences', 'time')}
    </div>
  );

  const renderProgressAnalytics = () => (
    <div className="p-1">
      <h2 className="text-xl font-semibold mb-6 text-[#0A4D68] flex items-center"><BarChart2 className="w-6 h-6 mr-2 text-[#05BFDB]" />Progress Tracking</h2>
      <h3 className="text-lg font-medium text-[#0A4D68] mb-3">Body Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderInput('Recent Weight (kg)', 'progress', 'weight', 'number')}
        {renderInput('Body Measurements (e.g., Waist: 32in)', 'progress', 'bodyMeasurements')}
      </div>
      <h3 className="text-lg font-medium text-[#0A4D68] mt-6 mb-3">Workout Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderInput('Total Workouts Completed', 'progress', 'totalWorkouts', 'number')}
        {renderInput('Current Workout Streak (days)', 'progress', 'streak', 'number')}
      </div>
      {renderInput('Favorite Exercises (comma-separated)', 'progress', 'favoriteExercises')}
      {renderInput('Most Active Days/Times', 'progress', 'activeDaysTimes')}
      {renderInput('Estimated Calories Burned (total)', 'progress', 'caloriesBurned', 'number')}
    </div>
  );

  const tabConfig = [
    { id: 'basic', label: 'Basic Info', icon: <User size={18}/>, content: renderBasicProfile },
    { id: 'goals', label: 'Goals', icon: <Target size={18}/>, content: renderGoalsPreferences },
    { id: 'progress', label: 'Progress', icon: <BarChart2 size={18}/>, content: renderProgressAnalytics },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-8 px-4">
      <div className="max-w-3xl mx-auto bg-[#FFFFFF] p-6 md:p-8 rounded-2xl shadow-xl border border-[#D1D1D1]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-3xl font-bold text-[#0B0B0B] mb-2 sm:mb-0">
                User Profile
            </h1>
            {isDirty && <span className="text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded-md flex items-center"><AlertCircle size={16} className="mr-1"/> Unsaved Changes</span>}
        </div>

        {saveMessage && (
            <div className={`mb-4 p-3 rounded-lg text-sm flex items-center ${saveMessage.toLowerCase().includes('error') || saveMessage.toLowerCase().includes('correct') ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'}`}>
                {saveMessage.toLowerCase().includes('error') || saveMessage.toLowerCase().includes('correct') ? <AlertCircle size={18} className="mr-2"/> : <CheckCircle size={18} className="mr-2"/>}
                {saveMessage}
            </div>
        )}

        <div className="mb-6 border-b border-[#D1D1D1]">
            <nav className="-mb-px flex space-x-1 sm:space-x-4" aria-label="Tabs">
            {tabConfig.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm flex items-center transition-colors
                                ${activeTab === tab.id 
                                    ? 'border-[#05BFDB] text-[#05BFDB]' 
                                    : 'border-transparent text-[#6C757D] hover:text-[#3E3E3E] hover:border-gray-300'
                                }`}
                >
                {React.cloneElement(tab.icon, { className: "mr-2" })}
                {tab.label}
                </button>
            ))}
            </nav>
        </div>

        <div>
            {tabConfig.find(tab => tab.id === activeTab)?.content()}
        </div>

        <div className="mt-10 pt-6 border-t border-[#D1D1D1] flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
            className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 bg-[#0A4D68] hover:bg-[#083D53] text-white font-semibold rounded-xl shadow-md transition-colors disabled:opacity-60"
            onClick={handleSave}
            disabled={!isDirty && !Object.values(fieldErrors).some(Boolean) && !emailError}
            >
            <Save size={18} className="mr-2" /> Save Profile
            </button>
            <div className="flex space-x-3">
                <button
                    className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm text-[#3E3E3E] bg-gray-200 hover:bg-gray-300 rounded-xl transition-colors"
                    onClick={() => navigate('/settings')} 
                >
                    Settings
                </button>
                <button
                    className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm text-white bg-[#DC3545] hover:bg-red-700 rounded-xl transition-colors"
                    onClick={handleDelete}
                >
                   <Trash2 size={16} className="mr-2" /> Delete Profile
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
