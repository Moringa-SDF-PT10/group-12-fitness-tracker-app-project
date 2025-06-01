import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation if needed
import { Settings as SettingsIcon, UserCircle, Zap, Bell, Share2, Eye, ShieldCheck, MessageSquare, Save, RotateCcw, AlertCircle, CheckCircle } from 'lucide-react'; // Icons

// --- Styled Form Components (can be in a shared file) ---
const StyledInputGroup = ({ label, children, error, htmlFor }) => (
  <div className="mb-5">
    <label htmlFor={htmlFor} className="block text-sm font-medium text-[#A1887F] mb-1">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1"/>{error}</p>}
  </div>
);

const StyledInput = React.forwardRef(({ onChange, error, ...props }, ref) => (
  <input
    ref={ref}
    onChange={e => onChange(e.target.value)}
    {...props}
    className={`w-full px-4 py-2.5 border ${error ? 'border-red-500':'border-[#F5E0D5]'} rounded-xl focus:ring-2 focus:ring-[#FFB6C1] focus:border-[#FFB6C1] bg-[#FFFFFF] text-[#6D4C41] placeholder-[#A1887F] transition-colors`}
  />
));

const StyledSelect = ({ value, onChange, options, ...props }) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    {...props}
    className="w-full px-4 py-2.5 border border-[#F5E0D5] rounded-xl focus:ring-2 focus:ring-[#FFB6C1] focus:border-[#FFB6C1] bg-[#FFFFFF] text-[#6D4C41] transition-colors appearance-none bg-no-repeat bg-right pr-8"
    style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23A1887F'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd' /%3E%3C/svg%3E")`}}
  >
    {options.map(opt => (
      <option key={opt.value || opt} value={opt.value || opt}>
        {opt.label || opt}
      </option>
    ))}
  </select>
);

const StyledToggle = ({ label, checked, onChange, id }) => (
  <div className="flex items-center justify-between py-2 my-1">
    <label htmlFor={id} className="text-sm font-medium text-[#6D4C41] cursor-pointer">{label}</label>
    <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
        <input
            type="checkbox"
            name={id}
            id={id}
            checked={checked}
            onChange={e => onChange(e.target.checked)}
            className="opacity-0 absolute block w-5 h-5 rounded-full appearance-none cursor-pointer peer"
        />
        <label
            htmlFor={id}
            className={`block overflow-hidden h-5 rounded-full cursor-pointer
                        ${checked ? 'bg-[#FFB6C1]' : 'bg-[#FFDAC1]/50'}
                        peer-focus:ring-2 peer-focus:ring-[#FFB6C1]/50 
                        transition-colors`}
        >
            <span className={`absolute left-0.5 top-0.5 block w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${checked ? 'translate-x-full' : ''}`}></span>
        </label>
    </div>
  </div>
);
// --- End Styled Form Components ---

const defaultUserData = {
    tab: 'Account',
    profile: {
      name: '',
      email: '',
      age: '',
      gender: 'Male',
      height: '',
      weight: '',
      photo: '',
    },
    goals: {
      type: '',
      target: '',
      timeframe: '',
    },
    preferences: {
      workouts: '',
      equipment: '',
      timeConstraints: '',
    },
    progress: {
      weight: '',
      totalWorkouts: '',
      streak: '',
      caloriesBurned: '',
    },
    notifications: {
      notifyWorkouts: false,
      notifyProgress: false,
      notifyPromotions: false,
    },
    appearance: {
      theme: 'light',
      fontSize: 'medium',
    },
    subscription: {
      plan: 'Free',
    },
    supportEmail: 'support@fitbuddy.com',
    feedback: '',
  };

const SettingsPage = () => {
  
  
  const [feedback, setFeedback] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const [userData, setUserData] = useState(defaultUserData);
  const [isDirty, setIsDirty] = useState(false);

  const API_URL = 'https://jsonplaceholder.typicode.com/posts';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const local = localStorage.getItem('userData');
        if (local) {
          setUserData(prev => ({ ...defaultUserData, ...JSON.parse(local) }));
        } else {
          const res = await fetch(API_URL);
          if (!res.ok) throw new Error('Fetch failed');
          const data = await res.json();
          const apiUserData = Array.isArray(data) ? data[0] : data;
          setUserData(prev => ({ ...defaultUserData, ...apiUserData }));
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', userData.appearance.theme);
    document.documentElement.setAttribute('data-font-size', userData.appearance.fontSize);
  }, [userData.appearance.theme, userData.appearance.fontSize]);

  const validateEmail = email => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

  const handleChange = (section, field, value) => {
    const numericFields = ['age', 'height', 'weight', 'streak', 'caloriesBurned', 'totalWorkouts'];
    const parsedValue = numericFields.includes(field) ? (parseFloat(value) || '') : value;

    setUserData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: parsedValue,
      },
    }));
    setIsDirty(true);
  };

  const handleToggle = (section, field, value) => {
    setUserData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setIsDirty(true);
  };

  const handleTabChange = tab => setUserData(prev => ({ ...prev, tab }));

  const resetSettings = () => {
    setUserData(defaultUserData);
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      localStorage.setItem('userData', JSON.stringify(userData));
      setIsDirty(false);

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!res.ok) throw new Error('Save failed');
      alert('Settings saved successfully!');
    } catch (err) {
      console.error('Save error:', err);
      alert('Error saving settings');
    }
  };

  const handleFeedbackSubmit = () => {
  if (feedback.trim() === '') {
    setFeedbackMessage('Please enter feedback before submitting.');
  } else {
    setFeedbackMessage('Thank you for your feedback! Our team will get back to you shortly');
    setFeedback(''); // clear input from the user
  }

  //clear the message after a few seconds
  setTimeout(() => setFeedbackMessage(''), 4000);
};

const tabsConfig = [
{ id: 'Account', label: 'Account', icon: <UserCircle /> },
{ id: 'Workout', label: 'Workout Goals', icon: <Zap /> },
{ id: 'Notifications', label: 'Notifications', icon: <Bell /> },
{ id: 'DataSync', label: 'Data & Sync', icon: <Share2 /> },
{ id: 'Appearance', label: 'Appearance', icon: <Eye /> },
{ id: 'Subscription', label: 'Subscription', icon: <ShieldCheck /> },
{ id: 'Support', label: 'Support', icon: <MessageSquare /> },
];

 const { profile, goals, preferences, notifications, appearance, subscription, supportEmail } = userData;

  const renderInput = (label, section, field, type = 'text') => (
    <StyledInputGroup label={label} htmlFor={field} error={field === 'email' && !validateEmail(profile.email) ? 'Invalid email' : ''}>
      <StyledInput
        id={field}
        type={type}
        value={userData[section][field]}
        onChange={val => handleChange(section, field, val)}
        placeholder={`Enter ${label}`}
        error={field === 'email' && !validateEmail(profile.email)}
      />
    </StyledInputGroup>
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#FFF5F7] rounded-2xl shadow-xl">
      <div className="flex justify-between mb-6">
        {['Account', 'Workout', 'Notifications', 'Appearance', 'Subscription', 'Support'].map(tab => (
          <button
            key={tab}
            className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors ${userData.tab === tab ? 'bg-[#FFB6C1] text-white' : 'bg-[#F5E0D5] text-[#6D4C41]'}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {userData.tab === 'Account' && (
        <div>
          {renderInput('Name', 'profile', 'name')}
          {renderInput('Email', 'profile', 'email', 'email')}
          {renderInput('Age', 'profile', 'age')}
          {renderInput('Height (cm)', 'profile', 'height')}
          {renderInput('Weight (kg)', 'profile', 'weight')}
          <StyledInputGroup label="Gender" htmlFor="gender">
            <StyledSelect
              value={profile.gender}
              onChange={val => handleChange('profile', 'gender', val)}
              options={['Male', 'Female', 'Other']}
            />
          </StyledInputGroup>
        </div>
      )}

      {userData.tab === 'Workout' && (
        <div>
          {['workouts', 'equipment', 'timeConstraints'].map(field => (
            renderInput(field.replace(/([A-Z])/g, ' $1'), 'preferences', field)
          ))}
        </div>
      )}

      {userData.tab === 'Notifications' && (
        <div>
          {Object.keys(notifications).map(key => (
            <StyledToggle
              key={key}
              id={key}
              label={key.replace('notify', '').replace(/([A-Z])/g, ' $1').trim()}
              checked={notifications[key]}
              onChange={val => handleToggle('notifications', key, val)}
            />
          ))}
        </div>
      )}

      {userData.tab === 'Appearance' && (
        <div>
          <StyledInputGroup label="Theme" htmlFor="theme">
            <StyledSelect
              value={appearance.theme}
              onChange={val => handleChange('appearance', 'theme', val)}
              options={['light', 'dark', 'system']}
            />
          </StyledInputGroup>
          <StyledInputGroup label="Font Size" htmlFor="fontSize">
            <StyledSelect
              value={appearance.fontSize}
              onChange={val => handleChange('appearance', 'fontSize', val)}
              options={['small', 'medium', 'large']}
            />
          </StyledInputGroup>
        </div>
      )}

      {userData.tab === 'Subscription' && (
        <StyledInputGroup label="Plan" htmlFor="plan">
          <StyledSelect
            value={subscription.plan}
            onChange={val => handleChange('subscription', 'plan', val)}
            options={['Free', 'Pro', 'Premium']}
          />
        </StyledInputGroup>
      )}

      {userData.tab === 'Support' && (
        <div>
          <p className="text-[#6D4C41] mb-2">Contact Support: {supportEmail}</p>
          <StyledInputGroup label="Feedback" htmlFor="feedback">
            <StyledInput
              id="feedback"
              value={feedback}
              onChange={setFeedback}
              placeholder="Write your feedback..."
            />
          </StyledInputGroup>
          <button
            className="bg-[#FFB6C1] text-white px-4 py-2 rounded-xl shadow hover:bg-[#f794b6] transition-colors"
            onClick={handleFeedbackSubmit}
          >
            Submit Feedback
          </button>
          {feedbackMessage && <p className="mt-2 text-green-600 flex items-center"><CheckCircle className="w-4 h-4 mr-1" />{feedbackMessage}</p>}
        </div>
      )}

      <div className="flex justify-between items-center mt-8">
        <button
          className="flex items-center gap-2 bg-[#FFB6C1] text-white px-4 py-2 rounded-xl shadow hover:bg-[#f794b6] transition-colors disabled:opacity-50"
          onClick={handleSave}
          disabled={!isDirty}
        >
          <Save className="w-4 h-4" /> Save Settings
        </button>
        <button
          className="flex items-center gap-2 text-[#6D4C41] bg-[#F5E0D5] px-4 py-2 rounded-xl hover:bg-[#f5d3c1] transition-colors"
          onClick={resetSettings}
        >
          <RotateCcw className="w-4 h-4" /> Reset to Defaults
        </button>
        {isDirty && (
          <span className="text-sm text-red-500 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" /> Unsaved changes
          </span>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;