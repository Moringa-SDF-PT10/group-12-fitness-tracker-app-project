// SettingsPage.jsx
import React, { useState, useEffect } from 'react';

function Input({ label, value, onChange, type = 'text', ...props }) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        {...props}
      />
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <div className="toggle-group">
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
        />
        {label}
      </label>
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div className="select-group">
      <label>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}>
        {options.map(opt => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

const defaultSettings = {
  tab: 'Account',
  name: '',
  email: '',
  age: '',
  height: '',
  weight: '',
  gender: '',
  workoutReminders: true,
  goalTracking: true,
  goalType: '',
  goalTarget: '',
  goalTimeframe: '',
  goalNotificationTime: '',
  goalAlertMethod: '',
  notifyWorkouts: true,
  notifyProgress: false,
  notifyPromotions: true,
  syncGoogleFit: false,
  syncAppleHealth: false,
  syncFrequency: '',
  syncOverWifiOnly: false,
  theme: 'light',
  fontSize: 'medium',
  subscriptionPlan: 'free',
  supportEmail: 'support@fitbuddy.com',
  feedback: '',
};

function SettingsPage() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('userData');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    document.documentElement.setAttribute('data-font-size', settings.fontSize);
  }, [settings.theme, settings.fontSize]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  const isEmailValid = validateEmail(settings.email);

  const resetSettings = () => setSettings(defaultSettings);

  const saveSettings = () => {
    localStorage.setItem('userData', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  return (
    <div className="settings-page">
      <div className="tabs">
        {['Account', 'Workout', 'Notifications', 'Data & Sync', 'Appearance', 'Subscription', 'Support'].map(tab => (
          <button
            key={tab}
            className={settings.tab === tab ? 'active' : ''}
            onClick={() => updateSetting('tab', tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {settings.tab === 'Account' && (
          <div>
            <Input label="Name" value={settings.name} onChange={val => updateSetting('name', val)} />
            <Input
              label="Email Address"
              type="email"
              value={settings.email}
              onChange={val => updateSetting('email', val)}
              style={{ borderColor: isEmailValid ? 'initial' : 'red' }}
            />
            {!isEmailValid && <p className="error">This is not a valid email address.</p>}
            <Input label="Age" type="number" value={settings.age} onChange={val => updateSetting('age', val)} />
            <Input label="Height (cm)" type="number" value={settings.height} onChange={val => updateSetting('height', val)} />
            <Input label="Weight (kg)" type="number" value={settings.weight} onChange={val => updateSetting('weight', val)} />
            <Select
              label="Gender"
              value={settings.gender}
              options={["Male", "Female", "Other"]}
              onChange={val => updateSetting('gender', val)}
            />
            <button onClick={saveSettings}>Update Changes</button>
            <button onClick={resetSettings} className="secondary">Reset to Defaults</button>
          </div>
        )}

        {settings.tab === 'Workout' && (
          <div>
            <Toggle label="Workout Reminders" checked={settings.workoutReminders} onChange={val => updateSetting('workoutReminders', val)} />
            <Toggle label="Goal Tracking" checked={settings.goalTracking} onChange={val => updateSetting('goalTracking', val)} />
            <Select
              label="Fitness Goal Type"
              value={settings.goalType}
              options={["Weight Loss", "Muscle Gain", "Endurance", "Flexibility"]}
              onChange={val => updateSetting('goalType', val)}
            />
            <Input label="Target (e.g., 5kg)" value={settings.goalTarget} onChange={val => updateSetting('goalTarget', val)} />
            <Input label="Timeframe (e.g., 3 months)" value={settings.goalTimeframe} onChange={val => updateSetting('goalTimeframe', val)} />
            <Input label="Notification Time" type="time" value={settings.goalNotificationTime} onChange={val => updateSetting('goalNotificationTime', val)} />
            <Select
              label="Alert Method"
              value={settings.goalAlertMethod}
              options={["Push Notification", "Email"]}
              onChange={val => updateSetting('goalAlertMethod', val)}
            />
            <button onClick={saveSettings}>Save Changes</button>
          </div>
        )}

        {settings.tab === 'Notifications' && (
          <div>
            <Toggle label="Workout Reminders" checked={settings.notifyWorkouts} onChange={val => updateSetting('notifyWorkouts', val)} />
            <Toggle label="Progress Updates" checked={settings.notifyProgress} onChange={val => updateSetting('notifyProgress', val)} />
            <Toggle label="Promotional Offers" checked={settings.notifyPromotions} onChange={val => updateSetting('notifyPromotions', val)} />
            <button onClick={saveSettings}>Save Changes</button>
          </div>
        )}

        {settings.tab === 'Data & Sync' && (
          <div>
            <Toggle label="Sync with Google Fit" checked={settings.syncGoogleFit} onChange={val => updateSetting('syncGoogleFit', val)} />
            <Toggle label="Sync with Apple Health" checked={settings.syncAppleHealth} onChange={val => updateSetting('syncAppleHealth', val)} />
            <Select
              label="Sync Frequency"
              value={settings.syncFrequency}
              options={["Daily", "Weekly", "Monthly"]}
              onChange={val => updateSetting('syncFrequency', val)}
            />
            <Toggle label="Sync over Wi-Fi only" checked={settings.syncOverWifiOnly} onChange={val => updateSetting('syncOverWifiOnly', val)} />
            <button onClick={saveSettings}>Save Changes</button>
          </div>
        )}

        {settings.tab === 'Appearance' && (
          <div>
            <Select
              label="Theme"
              value={settings.theme}
              options={["light", "dark", "system"]}
              onChange={val => updateSetting('theme', val)}
            />
            <Select
              label="Font Size"
              value={settings.fontSize}
              options={["small", "medium", "large"]}
              onChange={val => updateSetting('fontSize', val)}
            />
            <button onClick={saveSettings}>Save Changes</button>
          </div>
        )}

        {settings.tab === 'Subscription' && (
          <div>
            <p>Current Plan: {settings.subscriptionPlan}</p>
            <button>Upgrade Plan</button>
          </div>
        )}

        {settings.tab === 'Support' && (
          <div>
            <p>Contact Support: {settings.supportEmail}</p>
            <Input
              label="Send Feedback"
              value={settings.feedback}
              onChange={val => updateSetting('feedback', val)}
            />
            <button>Submit</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsPage;
