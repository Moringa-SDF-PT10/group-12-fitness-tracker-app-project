import React, { useState, useEffect } from 'react';

const SettingsPage = () => {
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
