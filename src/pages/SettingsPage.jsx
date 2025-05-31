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

const initialSettings = {
  tab: 'Account', name: 'Desmond Voyage', email: 'voyage@example.com', age: 30, height: 175, weight: 70, gender: 'Male',
  workoutReminders: true, goalTracking: true, goalType: 'Weight Loss', goalTarget: 'Lose 5kg', goalTimeframe: '3 months',
  goalNotificationTime: '08:00', goalAlertMethod: 'Push Notification',
  notifyProgressUpdates: true, notifyPromotions: false,
  syncGoogleFit: false, syncAppleHealth: true, syncFrequency: 'Daily', syncOverWifiOnly: false,
  theme: 'light', fontSize: 'medium',
  subscriptionPlan: 'Premium', supportEmail: 'support@fitbuddy.com', feedback: '',
};


function SettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(() => {
    try {
        const saved = localStorage.getItem('appSettings'); // Use a specific key
        return saved ? { ...initialSettings, ...JSON.parse(saved) } : initialSettings;
    } catch (error) {
        console.error("Failed to parse appSettings from localStorage", error);
        return initialSettings;
    }
  });
  const [emailError, setEmailError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    document.documentElement.style.setProperty('--font-scale-factor', 
        settings.fontSize === 'small' ? '0.9' : settings.fontSize === 'large' ? '1.1' : '1');
  }, [settings.theme, settings.fontSize]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
     if (key === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        setEmailError('Email is required.');
      } else if (!emailRegex.test(value)) {
        setEmailError('Please enter a valid email address.');
      } else {
        setEmailError('');
      }
    }
  };

  const resetToDefaults = () => {
    if(window.confirm("Are you sure you want to reset all settings to their default values? This action cannot be undone.")){
        setSettings(initialSettings);
        setEmailError('');
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 3000);
    }
  };

  const handleSaveChanges = () => {
    if (emailError && settings.tab === 'Account') { // Only block save if email error is relevant to current tab
        alert("Please fix the errors in the Account tab before saving.");
        return;
    }
    localStorage.setItem('appSettings', JSON.stringify(settings));
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
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

  return (
    <div className="min-h-screen bg-[#FFF7F5] p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#6D4C41] flex items-center">
            <SettingsIcon className="w-8 h-8 mr-3 text-[#FFB6C1]" /> Application Settings
        </h1>
      </header>

      <div className="bg-[#FFFFFF] p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-[#F5E0D5]">
        <div className="mb-8 flex flex-wrap -mx-1 border-b-2 border-[#FFDAC1]/50">
          {tabsConfig.map(tab => (
            <button
              key={tab.id}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-colors focus:outline-none
                          ${settings.tab === tab.id
                              ? 'border-b-2 border-[#FFB6C1] text-[#FFB6C1]'
                              : 'text-[#A1887F] hover:text-[#6D4C41]'
                          }`}
              onClick={() => updateSetting('tab', tab.id)}
            >
              {React.cloneElement(tab.icon, {className: "w-4 h-4 sm:w-5 sm:h-5"})}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="tab-content min-h-[300px]"> {/* Added min-height for consistent spacing */}
          {settings.tab === 'Account' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <StyledInputGroup label="Full Name" htmlFor="name">
                <StyledInput id="name" value={settings.name} onChange={val => updateSetting('name', val)} />
              </StyledInputGroup>
              <StyledInputGroup label="Email Address" htmlFor="email" error={emailError}>
                <StyledInput id="email" type="email" value={settings.email} onChange={val => updateSetting('email', val)} error={!!emailError} />
              </StyledInputGroup>
              <StyledInputGroup label="Age" htmlFor="age">
                <StyledInput id="age" type="number" value={settings.age} onChange={val => updateSetting('age', val)} />
              </StyledInputGroup>
              <StyledInputGroup label="Gender" htmlFor="gender">
                <StyledSelect id="gender" value={settings.gender} options={["Male", "Female", "Non-binary", "Prefer not to say"]} onChange={val => updateSetting('gender', val)} />
              </StyledInputGroup>
              <StyledInputGroup label="Height (cm)" htmlFor="height">
                <StyledInput id="height" type="number" value={settings.height} onChange={val => updateSetting('height', val)} />
              </StyledInputGroup>
              <StyledInputGroup label="Weight (kg)" htmlFor="weight">
                <StyledInput id="weight" type="number" value={settings.weight} onChange={val => updateSetting('weight', val)} />
              </StyledInputGroup>
            </div>
          )}

          {settings.tab === 'Workout' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <div className="md:col-span-2">
                    <StyledToggle id="workoutReminders" label="Enable Workout Reminders" checked={settings.workoutReminders} onChange={val => updateSetting('workoutReminders', val)} />
                    <StyledToggle id="goalTracking" label="Enable Goal Tracking" checked={settings.goalTracking} onChange={val => updateSetting('goalTracking', val)} />
                </div>
                <StyledInputGroup label="Fitness Goal Type" htmlFor="goalType">
                    <StyledSelect id="goalType" value={settings.goalType} options={["Weight Loss", "Muscle Gain", "Endurance Improvement", "Flexibility & Mobility", "General Fitness"]} onChange={val => updateSetting('goalType', val)} />
                </StyledInputGroup>
                <StyledInputGroup label="Specific Target" htmlFor="goalTarget">
                    <StyledInput id="goalTarget" value={settings.goalTarget} onChange={val => updateSetting('goalTarget', val)} placeholder="e.g., Lose 5kg, Run 10km" />
                </StyledInputGroup>
                <StyledInputGroup label="Desired Timeframe" htmlFor="goalTimeframe">
                    <StyledInput id="goalTimeframe" value={settings.goalTimeframe} onChange={val => updateSetting('goalTimeframe', val)} placeholder="e.g., 3 months, By December" />
                </StyledInputGroup>
                <StyledInputGroup label="Reminder Time for Goals" htmlFor="goalNotificationTime">
                    <StyledInput id="goalNotificationTime" type="time" value={settings.goalNotificationTime} onChange={val => updateSetting('goalNotificationTime', val)} />
                </StyledInputGroup>
                 <StyledInputGroup label="Goal Alert Method" htmlFor="goalAlertMethod">
                    <StyledSelect id="goalAlertMethod" value={settings.goalAlertMethod} options={["Push Notification", "Email", "In-app Alert"]} onChange={val => updateSetting('goalAlertMethod', val)} />
                </StyledInputGroup>
            </div>
          )}
          
          {settings.tab === 'Notifications' && (
            <div>
                <StyledToggle id="notifyProgressUpdates" label="Progress Updates & Milestones" checked={settings.notifyProgressUpdates} onChange={val => updateSetting('notifyProgressUpdates', val)} />
                <StyledToggle id="notifyPromotions" label="Special Offers & Promotions" checked={settings.notifyPromotions} onChange={val => updateSetting('notifyPromotions', val)} />
                <StyledToggle id="notifyAppUpdates" label="App Updates & New Features" checked={settings.notifyAppUpdates || true} onChange={val => updateSetting('notifyAppUpdates', val)} />
            </div>
          )}

          {settings.tab === 'DataSync' && (
             <div>
                <StyledToggle id="syncGoogleFit" label="Sync with Google Fit" checked={settings.syncGoogleFit} onChange={val => updateSetting('syncGoogleFit', val)} />
                <StyledToggle id="syncAppleHealth" label="Sync with Apple Health (iOS only)" checked={settings.syncAppleHealth} onChange={val => updateSetting('syncAppleHealth', val)} />
                <StyledInputGroup label="Automatic Sync Frequency" htmlFor="syncFrequency">
                    <StyledSelect id="syncFrequency" value={settings.syncFrequency} options={["Never", "Daily", "Every 12 hours", "Weekly"]} onChange={val => updateSetting('syncFrequency', val)} />
                </StyledInputGroup>
                <StyledToggle id="syncOverWifiOnly" label="Sync over Wi-Fi only" checked={settings.syncOverWifiOnly} onChange={val => updateSetting('syncOverWifiOnly', val)} />
            </div>
          )}

          {settings.tab === 'Appearance' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <StyledInputGroup label="Application Theme" htmlFor="theme">
                    <StyledSelect id="theme" value={settings.theme} options={[{value: 'light', label: 'Light Mode'}, {value: 'dark', label: 'Dark Mode'}, {value: 'system', label: 'System Default'}]} onChange={val => updateSetting('theme', val)} />
                </StyledInputGroup>
                <StyledInputGroup label="Font Size" htmlFor="fontSize">
                    <StyledSelect id="fontSize" value={settings.fontSize} options={[{value: 'small', label: 'Small'}, {value: 'medium', label: 'Medium (Default)'}, {value: 'large', label: 'Large'}]} onChange={val => updateSetting('fontSize', val)} />
                </StyledInputGroup>
            </div>
          )}
          
          {settings.tab === 'Subscription' && (
            <div>
                <p className="text-md text-[#6D4C41] mb-2">Your Current Plan: <span className="font-semibold text-[#FFB6C1]">{settings.subscriptionPlan}</span></p>
                {settings.subscriptionPlan.toLowerCase() === 'free' ? (
                    <button className="px-6 py-2.5 bg-[#FFB6C1] hover:bg-opacity-80 text-white font-semibold rounded-xl shadow hover:shadow-md transition-all">
                        Upgrade to Premium
                    </button>
                ) : (
                    <p className="text-sm text-[#A1887F]">You have access to all premium features. Thank you!</p>
                )}
                {/* More subscription details can go here */}
            </div>
          )}

          {settings.tab === 'Support' && (
            <div>
                <p className="text-md text-[#6D4C41] mb-4">Need help? Contact us at: <a href={`mailto:${settings.supportEmail}`} className="text-[#FFB6C1] hover:underline">{settings.supportEmail}</a></p>
                <StyledInputGroup label="Send Feedback or Report an Issue" htmlFor="feedback">
                    <textarea
                        id="feedback"
                        value={settings.feedback}
                        onChange={e => updateSetting('feedback', e.target.value)}
                        rows="4"
                        className="w-full px-4 py-2.5 border border-[#F5E0D5] rounded-xl focus:ring-2 focus:ring-[#FFB6C1] focus:border-[#FFB6C1] bg-[#FFFFFF] text-[#6D4C41] placeholder-[#A1887F] transition-colors"
                        placeholder="We value your feedback..."
                    />
                </StyledInputGroup>
                <button 
                    className="px-6 py-2.5 bg-[#FFB6C1] hover:bg-opacity-80 text-white font-semibold rounded-xl shadow hover:shadow-md transition-all"
                    onClick={() => { alert('Feedback submitted. Thank you!'); updateSetting('feedback', '');}}
                    disabled={!settings.feedback.trim()}
                >
                    Submit Feedback
                </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-10 pt-6 border-t border-[#FFDAC1]/50 flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            {showConfirmation && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity:0 }}
                    className="flex items-center text-green-600 text-sm order-first sm:order-none sm:mr-auto"
                >
                    <CheckCircle className="w-5 h-5 mr-2"/> Settings saved!
                </motion.div>
            )}
            <button
                onClick={resetToDefaults}
                className="w-full sm:w-auto px-6 py-2.5 text-[#6D4C41] bg-[#FFDAC1]/50 hover:bg-[#FFDAC1]/80 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center"
            >
               <RotateCcw className="w-4 h-4 mr-2" /> Reset Defaults
            </button>
            <button 
                className={`w-full sm:w-auto px-8 py-2.5 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center
                            ${(settings.tab === 'Account' && !!emailError) ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FFB6C1] hover:bg-opacity-80'}`}
                onClick={handleSaveChanges}
                disabled={(settings.tab === 'Account' && !!emailError)}
            >
                <Save className="w-5 h-5 mr-2"/> Save Changes
            </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;