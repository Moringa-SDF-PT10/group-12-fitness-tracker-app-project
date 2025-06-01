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


  const { profile, goals, preferences, notifications, appearance, subscription, supportEmail } = userData;

  return (
    <div className="settings-page">
      <div className="tabs">
        {['Account', 'Workout', 'Notifications', 'Appearance', 'Subscription', 'Support'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${userData.tab === tab ? 'active' : ''}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="settings-section">
        {userData.tab === 'Account' && (
          <div className="section account-section">
            {['name', 'email', 'age', 'height', 'weight'].map(field => (
              <div key={field} className="input-group">
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  value={profile[field]}
                  onChange={e => handleChange('profile', field, e.target.value)}
                  className={field === 'email' && !validateEmail(profile.email) ? 'input-error' : ''}
                />
                {field === 'email' && !validateEmail(profile.email) && (
                  <span className="error-text">Invalid email</span>
                )}
              </div>
            ))}
            <div className="input-group">
              <label>Gender</label>
              <select value={profile.gender} onChange={e => handleChange('profile', 'gender', e.target.value)}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        )}

        {userData.tab === 'Workout' && (
          <div className="section workout-section">
            {['workouts', 'equipment', 'timeConstraints'].map(field => (
              <div key={field} className="input-group">
                <label>{field.replace(/([A-Z])/g, ' $1')}</label>
                <input
                  type="text"
                  value={preferences[field]}
                  onChange={e => handleChange('preferences', field, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}

        {userData.tab === 'Notifications' && (
          <div className="section notification-section">
            {Object.keys(notifications).map(key => (
              <div key={key} className="toggle-wrapper">
                <label>
                  <input
                    type="checkbox"
                    checked={notifications[key]}
                    onChange={e => handleToggle('notifications', key, e.target.checked)}
                  />
                  {key.replace('notify', '').replace(/([A-Z])/g, ' $1').trim()}
                </label>
              </div>
            ))}
          </div>
        )}

        {userData.tab === 'Appearance' && (
          <div className="section appearance-section">
            <div className="input-group">
              <label>Theme</label>
              <select value={appearance.theme} onChange={e => handleChange('appearance', 'theme', e.target.value)}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div className="input-group">
              <label>Font Size</label>
              <select value={appearance.fontSize} onChange={e => handleChange('appearance', 'fontSize', e.target.value)}>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        )}

        {userData.tab === 'Subscription' && (
        <div className="settings-section">
          <h2>Subscription</h2>
          <label>
            Plan
            <select
              value={userData.subscription.plan}
              onChange={e => handleChange('subscription', 'plan', e.target.value)}
            >
              <option value="Free">Free</option>
              <option value="Pro">Pro</option>
              <option value="Premium">Premium</option>
            </select>
          </label>
        </div>
        )}

        {userData.tab === 'Support' && (
          <div className="section support-section">
            <p>Contact Support: {supportEmail}</p>
            <div className="input-group">
              <label>Feedback</label>
              <input
                type="text"
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
              />
              <button onClick={handleFeedbackSubmit}>Submit</button>
            </div>
            {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}
          </div>
        )}


        <div className="settings-actions">
          <button className="btn btn-save" onClick={handleSave} disabled={!isDirty}>
            Save Settings
          </button>
          <button className="btn btn-reset" onClick={resetSettings}>
            Reset to Defaults
          </button>
          {isDirty && <span className="unsaved-warning">You have unsaved changes</span>}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
