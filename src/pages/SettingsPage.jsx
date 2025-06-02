import React, { useState, useEffect, useContext } from 'react'; // Added useContext
import { useNavigate } from 'react-router-dom';
import { 
    Settings as SettingsIcon, UserCircle, Zap, Bell, Eye, ShieldCheck, MessageSquare, 
    Save, RotateCcw, AlertCircle, CheckCircle, LogOut // Added LogOut
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const StyledInputGroup = ({ label, children, error, htmlFor }) => (
  <div className="mb-5">
    <label htmlFor={htmlFor} className="block text-sm font-medium text-[#6C757D] mb-1">{label}</label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1"/>{error}</p>}
  </div>
);

const StyledInput = React.forwardRef(({ value, onChange, error, ...props }, ref) => (
  <input
    ref={ref}
    value={value}
    onChange={e => onChange(e.target.value)}
    {...props}
    className={`w-full px-4 py-2.5 border ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500':'border-[#B0B0B0] focus:ring-[#05BFDB] focus:border-[#05BFDB]'} rounded-xl bg-[#FFFFFF] text-[#3E3E3E] placeholder-[#6C757D] transition-colors`}
  />
));

const StyledSelect = ({ value, onChange, options, ...props }) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    {...props}
    className="w-full px-4 py-2.5 border border-[#B0B0B0] rounded-xl focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-[#FFFFFF] text-[#3E3E3E] transition-colors appearance-none bg-no-repeat bg-right pr-8"
    style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236C757D'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd' /%3E%3C/svg%3E")`}}
  >
    {options.map(opt => (
      <option key={opt.value || opt} value={opt.value || opt}>
        {opt.label || opt}
      </option>
    ))}
  </select>
);

const StyledToggle = ({ label, checked, onChange, id }) => (
  <div className="flex items-center justify-between py-3 my-1 border-b border-[#E0E0E0] last:border-b-0">
    <label htmlFor={id} className="text-sm font-medium text-[#3E3E3E] cursor-pointer">{label}</label>
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
                        ${checked ? 'bg-[#05BFDB]' : 'bg-[#B0B0B0]'} 
                        peer-focus:ring-2 peer-focus:ring-[#05BFDB]/50 
                        transition-colors`}
        >
            <span className={`absolute left-0.5 top-0.5 block w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${checked ? 'translate-x-full' : ''}`}></span>
        </label>
    </div>
  </div>
);

const defaultSettingsData = {
    profile: { name: '', email: '' }, 
    notifications: {
      notifyWorkouts: false,
      notifyProgress: false,
      notifyPromotions: false,
      emailNotifications: true,
      pushNotifications: true,
    },
    appearance: { theme: 'light', fontSize: 'medium', reduceMotion: false },
    privacy: { dataSharing: false, activityVisibility: 'friends' },
    account: { twoFactorAuth: false },
    supportEmail: 'support@fit-mate.netlify.app/',
    feedback: '',
  };


const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState('Account');
  const [settingsData, setSettingsData] = useState(() => {
      const storedSettings = localStorage.getItem('userSettings');
      if (storedSettings) {
          try {
              const parsed = JSON.parse(storedSettings);
              // Deep merge with defaults
              return {
                  ...defaultSettingsData,
                  ...parsed,
                  profile: { ...defaultSettingsData.profile, ...parsed.profile },
                  notifications: { ...defaultSettingsData.notifications, ...parsed.notifications },
                  appearance: { ...defaultSettingsData.appearance, ...parsed.appearance },
                  privacy: { ...defaultSettingsData.privacy, ...parsed.privacy },
                  account: { ...defaultSettingsData.account, ...parsed.account },
              };
          } catch (e) {
              console.error("Failed to parse settings from localStorage", e);
          }
      }
      return defaultSettingsData;
  });

  const [isDirty, setIsDirty] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [emailError, setEmailError] = useState('');

  // Populate profile from AuthContext if available and settings are default
  useEffect(() => {
    if (user && settingsData.profile.email === '' && settingsData.profile.name === '') {
        setSettingsData(prev => ({
            ...prev,
            profile: {
                name: user.name || '',
                email: user.email || ''
            }
        }));
    }
  }, [user, settingsData.profile.email, settingsData.profile.name ]);


  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settingsData.appearance.theme);
    document.documentElement.setAttribute('data-font-size', settingsData.appearance.fontSize);
  }, [settingsData.appearance.theme, settingsData.appearance.fontSize]);

  const validateEmail = email => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

  const handleChange = (section, field, value) => {
    setSettingsData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setIsDirty(true);
    if (section === 'profile' && field === 'email') {
        setEmailError(validateEmail(value) || value === '' ? '' : 'Invalid email format.');
    }
  };

  const handleToggle = (section, field, value) => {
    handleChange(section, field, value);
  };

  const handleTabChange = tab => setActiveTab(tab);

  const resetToDefaults = () => {
    const profileToKeep = user ? { name: user.name || '', email: user.email || '' } : defaultSettingsData.profile;
    setSettingsData({
        ...defaultSettingsData,
        profile: profileToKeep
    });
    setIsDirty(true);
    setFeedbackMessage('Settings reset to defaults.');
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const handleSave = async () => {
    if (settingsData.profile.email && !validateEmail(settingsData.profile.email)) {
        setEmailError('Invalid email format. Please correct before saving.');
        setFeedbackMessage('Cannot save: Invalid email format.');
        setTimeout(() => setFeedbackMessage(''), 3000);
        return;
    }
    setEmailError('');

    try {
      localStorage.setItem('userSettings', JSON.stringify(settingsData));
      setIsDirty(false);
      setFeedbackMessage('Settings saved successfully!');
    } catch (err) {
      console.error('Save error:', err);
      setFeedbackMessage('Error: Could not save settings.');
    }
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const handleFeedbackSubmit = () => {
    if (settingsData.feedback.trim() === '') {
      setFeedbackMessage('Please enter your feedback before submitting.');
    } else {
      console.log("Feedback submitted:", settingsData.feedback); // Mock submission
      setFeedbackMessage('Thank you for your feedback!');
      handleChange('feedback', '', ''); // Clear feedback field
    }
    setTimeout(() => setFeedbackMessage(''), 4000);
  };

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  const tabsConfig = [
    { id: 'Account', label: 'Account', icon: <UserCircle size={18}/> },
    { id: 'Notifications', label: 'Notifications', icon: <Bell size={18}/> },
    { id: 'Appearance', label: 'Appearance', icon: <Eye size={18}/> },
    { id: 'Privacy', label: 'Privacy & Data', icon: <ShieldCheck size={18}/> },
    { id: 'Support', label: 'Support', icon: <MessageSquare size={18}/> },
  ];

 const { profile, notifications, appearance, privacy, account: accountSettings, supportEmail, feedback } = settingsData;


  return (
    <div className="min-h-screen bg-[#F5F5F5] py-8 px-4">
      <div className="max-w-3xl mx-auto bg-[#FFFFFF] p-6 md:p-8 rounded-2xl shadow-xl border border-[#D1D1D1]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-3xl font-bold text-[#0B0B0B] mb-2 sm:mb-0 flex items-center">
                <SettingsIcon size={30} className="mr-3 text-[#05BFDB]" /> Settings
            </h1>
            {isDirty && <span className="text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded-md flex items-center"><AlertCircle size={16} className="mr-1"/> Unsaved Changes</span>}
        </div>

        {feedbackMessage && (
            <div className={`mb-4 p-3 rounded-lg text-sm flex items-center ${feedbackMessage.toLowerCase().includes('error') || feedbackMessage.toLowerCase().includes('cannot save') || feedbackMessage.toLowerCase().includes('please enter') ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'}`}>
                {feedbackMessage.toLowerCase().includes('error') || feedbackMessage.toLowerCase().includes('cannot save') || feedbackMessage.toLowerCase().includes('please enter') ? <AlertCircle size={18} className="mr-2"/> : <CheckCircle size={18} className="mr-2"/>}
                {feedbackMessage}
            </div>
        )}

        <div className="mb-6 border-b border-[#D1D1D1]">
            <nav className="-mb-px flex space-x-1 sm:space-x-4 overflow-x-auto" aria-label="Tabs">
            {tabsConfig.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`whitespace-nowrap pb-3 px-2 sm:px-3 border-b-2 font-medium text-sm flex items-center transition-colors
                                ${activeTab === tab.id 
                                    ? 'border-[#05BFDB] text-[#05BFDB]' 
                                    : 'border-transparent text-[#6C757D] hover:text-[#3E3E3E] hover:border-gray-300'
                                }`}
                >
                {React.cloneElement(tab.icon, { className: "mr-1.5 sm:mr-2" })}
                {tab.label}
                </button>
            ))}
            </nav>
        </div>

        <div className="mt-2">
            {activeTab === 'Account' && (
            <div>
                <h3 className="text-xl font-semibold text-[#0A4D68] mb-4">Profile Information</h3>
                <StyledInputGroup label="Full Name" htmlFor="profile-name" >
                    <StyledInput id="profile-name" type="text" value={profile.name} onChange={val => handleChange('profile', 'name', val)} placeholder="Your full name" />
                </StyledInputGroup>
                <StyledInputGroup label="Email Address" htmlFor="profile-email" error={emailError}>
                    <StyledInput id="profile-email" type="email" value={profile.email} onChange={val => handleChange('profile', 'email', val)} placeholder="you@example.com" error={!!emailError} />
                </StyledInputGroup>
                <button onClick={() => navigate('/profile')} className="mt-2 text-sm text-[#05BFDB] hover:text-[#049DB4] font-medium">
                    Edit Full Profile (Age, Weight, Goals etc.) &rarr;
                </button>
                <hr className="my-6 border-[#E0E0E0]" />
                <h3 className="text-xl font-semibold text-[#0A4D68] mb-4">Security</h3>
                 <StyledToggle id="2fa-toggle" label="Enable Two-Factor Authentication" checked={accountSettings.twoFactorAuth} onChange={val => handleToggle('account', 'twoFactorAuth', val)} />
                <button className="mt-3 text-sm text-[#05BFDB] hover:text-[#049DB4] font-medium">Change Password</button>
            </div>
            )}

            {activeTab === 'Notifications' && (
            <div>
                <h3 className="text-xl font-semibold text-[#0A4D68] mb-2">Notification Preferences</h3>
                <StyledToggle id="notifyWorkouts" label="Workout Reminders" checked={notifications.notifyWorkouts} onChange={val => handleToggle('notifications', 'notifyWorkouts', val)} />
                <StyledToggle id="notifyProgress" label="Progress Milestones" checked={notifications.notifyProgress} onChange={val => handleToggle('notifications', 'notifyProgress', val)} />
                <StyledToggle id="notifyPromotions" label="Promotions & Offers" checked={notifications.notifyPromotions} onChange={val => handleToggle('notifications', 'notifyPromotions', val)} />
                <StyledToggle id="emailNotifications" label="Receive Email Notifications" checked={notifications.emailNotifications} onChange={val => handleToggle('notifications', 'emailNotifications', val)} />
                <StyledToggle id="pushNotifications" label="Receive Push Notifications" checked={notifications.pushNotifications} onChange={val => handleToggle('notifications', 'pushNotifications', val)} />
            </div>
            )}

            {activeTab === 'Appearance' && (
            <div>
                <h3 className="text-xl font-semibold text-[#0A4D68] mb-4">Display Settings</h3>
                <StyledInputGroup label="Theme" htmlFor="theme-select">
                    <StyledSelect id="theme-select" value={appearance.theme} onChange={val => handleChange('appearance', 'theme', val)} options={[{label: 'Light', value: 'light'}, {label: 'Dark', value: 'dark'}, {label: 'System Default', value: 'system'}]} />
                </StyledInputGroup>
                <StyledInputGroup label="Font Size" htmlFor="fontSize-select">
                    <StyledSelect id="fontSize-select" value={appearance.fontSize} onChange={val => handleChange('appearance', 'fontSize', val)} options={[{label: 'Small', value: 'small'}, {label: 'Medium', value: 'medium'}, {label: 'Large', value: 'large'}]} />
                </StyledInputGroup>
                <StyledToggle id="reduceMotion" label="Reduce Motion (for animations)" checked={appearance.reduceMotion} onChange={val => handleToggle('appearance', 'reduceMotion', val)} />
            </div>
            )}

            {activeTab === 'Privacy' && (
            <div>
                <h3 className="text-xl font-semibold text-[#0A4D68] mb-4">Privacy & Data Management</h3>
                <StyledToggle id="dataSharing" label="Allow Data Sharing for Personalized Ads" checked={privacy.dataSharing} onChange={val => handleToggle('privacy', 'dataSharing', val)} />
                <StyledInputGroup label="Workout Activity Visibility" htmlFor="activityVisibility-select">
                    <StyledSelect id="activityVisibility-select" value={privacy.activityVisibility} onChange={val => handleChange('privacy', 'activityVisibility', val)} options={[{label: 'Everyone', value: 'everyone'}, {label: 'Friends Only', value: 'friends'}, {label: 'Only Me (Private)', value: 'private'}]} />
                </StyledInputGroup>
                <button className="mt-3 text-sm text-[#05BFDB] hover:text-[#049DB4] font-medium">Download My Data</button><br/>
                <button className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium">Request Account Deletion</button>
            </div>
            )}

            {activeTab === 'Support' && (
            <div>
                <h3 className="text-xl font-semibold text-[#0A4D68] mb-4">Help & Support</h3>
                <p className="text-[#3E3E3E] mb-1 text-sm">Have questions or need help? Contact us:</p>
                <a href={`mailto:${supportEmail}`} className="text-[#05BFDB] hover:text-[#049DB4] font-medium text-sm">{supportEmail}</a>
                
                <hr className="my-6 border-[#E0E0E0]" />
                <h3 className="text-lg font-semibold text-[#0A4D68] mb-3">Send Feedback</h3>
                <StyledInputGroup label="Your Feedback" htmlFor="feedback-input">
                    <textarea id="feedback-input" value={feedback} onChange={(e) => handleChange('feedback', e.target.value)} placeholder="Tell us what you think or any issues you've encountered..." rows="4"
                        className="w-full px-3 py-2.5 border border-[#B0B0B0] rounded-xl focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-[#FFFFFF] text-[#3E3E3E] placeholder-[#6C757D] transition-colors"
                    />
                </StyledInputGroup>
                <button
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#05BFDB] hover:bg-[#049DB4] text-[#0B0B0B] font-semibold rounded-xl shadow-md transition-colors"
                    onClick={handleFeedbackSubmit}
                >
                    Submit Feedback
                </button>
            </div>
            )}
        </div>

        <div className="mt-10 pt-6 border-t border-[#D1D1D1] flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                    className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 bg-[#0A4D68] hover:bg-[#083D53] text-white font-semibold rounded-xl shadow-md transition-colors disabled:opacity-60"
                    onClick={handleSave}
                    disabled={!isDirty || (!!emailError && profile.email !== '')}
                >
                    <Save size={18} className="mr-2" /> Save Settings
                </button>
                <button
                    className="w-full sm:w-auto flex items-center justify-center px-4 py-2.5 text-sm text-[#3E3E3E] bg-gray-200 hover:bg-gray-300 rounded-xl transition-colors"
                    onClick={resetToDefaults}
                >
                    <RotateCcw size={16} className="mr-2" /> Reset to Defaults
                </button>
            </div>
            <button
                onClick={handleLogout}
                className="w-full sm:w-auto flex items-center justify-center px-4 py-2.5 text-sm text-white bg-red-600 hover:bg-red-700 font-medium rounded-xl transition-colors"
            >
                <LogOut size={16} className="mr-2" /> Logout
            </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
