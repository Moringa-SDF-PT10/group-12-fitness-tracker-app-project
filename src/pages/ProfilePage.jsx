// ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Edit3, Target, BarChart2, Save, Image as ImageIcon, AlertCircle, CheckCircle, LogOut } from 'lucide-react'; // Added icons

// Styled Input Component (can be moved to a shared components file)
const StyledInput = ({ label, id, error, ...props }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-[#A1887F] mb-1">{label}</label>
    <input
      id={id}
      {...props}
      className={`w-full px-4 py-2.5 border ${error ? 'border-red-500' : 'border-[#F5E0D5]'} rounded-xl focus:ring-2 focus:ring-[#FFB6C1] focus:border-[#FFB6C1] bg-[#FFFFFF] text-[#6D4C41] placeholder-[#A1887F] transition-colors`}
    />
    {error && <p className="text-red-500 text-xs mt-1 flex items-center"><AlertCircle className="w-4 h-4 mr-1"/>{error}</p>}
  </div>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [showConfirmation, setShowConfirmation] = useState(false);


  const defaultProfileData = {
    name: 'Desmond Voyage', email: 'voyage@example.com', age: 30, gender: 'Male',
    height: 175, weight: 70, fitnessLevel: 'Intermediate', profilePhoto: '',
    goalType: 'Weight Loss', goalTarget: 'Lose 5 kg', goalTimeframe: '3 months',
    preferredWorkouts: 'Cardio, Strength', availableEquipment: 'Dumbbells, Treadmill',
    timeConstraints: '45 minutes/day', recentWeight: 70,
    bodyMeasurements: 'Chest: 95cm, Waist: 85cm, Hips: 70cm', totalWorkouts: 45,
    streak: 10, favoriteExercises: 'Push-ups, Squats', activeDaysTimes: 'Mon/Wed/Fri - Morning',
    caloriesBurned: 12000,
  };

  const [userData, setProfileData] = useState(() => {
    try {
        const storedData = localStorage.getItem('userDataProfile'); // Use a specific key for profile
        return storedData ? JSON.parse(storedData) : defaultProfileData;
    } catch (error) {
        console.error("Failed to parse userDataProfile from localStorage", error);
        return defaultProfileData;
    }
  });
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    localStorage.setItem('userDataProfile', JSON.stringify(userData));
  }, [userData]);

  const calculateBMI = (weight, height) => {
    if (!weight || !height || parseFloat(height) === 0) return '-';
    const heightInMeters = parseFloat(height) / 100;
    const bmi = parseFloat(weight) / (heightInMeters * heightInMeters);
    return isNaN(bmi) ? '-' : bmi.toFixed(1);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({ ...prev, profilePhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
        alert("Please upload a valid image file.");
    }
  };
  
  const handleChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    if (field === 'email') {
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

  const handleSave = () => {
    if (emailError) {
        alert("Please fix the errors before saving.");
        return;
    }
    localStorage.setItem('userDataProfile', JSON.stringify(userData));
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000); // Hide after 3 seconds
  };

  const Card = ({ titleIcon, title, children }) => (
    <div className="bg-[#FFFFFF] p-6 rounded-2xl shadow-lg border border-[#F5E0D5] mb-6">
        <h2 className="text-xl font-semibold text-[#6D4C41] mb-6 flex items-center">
            {React.cloneElement(titleIcon, {className: "w-6 h-6 mr-3 text-[#FFB6C1]"})}
            {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-0">
            {children}
        </div>
    </div>
  );

  const renderBasicProfile = () => (
    <Card title="Basic Profile" titleIcon={<User />}>
      <div className="md:col-span-2 mb-4 flex flex-col items-center">
        <img
          src={userData.profilePhoto || '/default-profile.png'} // Ensure you have a default image at this path or use an import
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover mb-3 border-4 border-[#FFDAC1]"
        />
        <label htmlFor="photo-upload" className="cursor-pointer inline-flex items-center px-4 py-2 bg-[#FFB6C1] text-white text-sm font-medium rounded-lg hover:bg-opacity-80 transition">
            <ImageIcon className="w-4 h-4 mr-2" />
            Upload Photo
        </label>
        <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
      </div>
      <StyledInput label="Name" id="name" value={userData.name} onChange={e => handleChange('name', e.target.value)} />
      <StyledInput label="Email" id="email" type="email" value={userData.email} onChange={e => handleChange('email', e.target.value)} error={emailError} />
      <StyledInput label="Age" id="age" type="number" value={userData.age} onChange={e => handleChange('age', e.target.value)} />
      <StyledInput label="Gender" id="gender" value={userData.gender} onChange={e => handleChange('gender', e.target.value)} placeholder="e.g., Male, Female, Non-binary" />
      <StyledInput label="Height (cm)" id="height" type="number" value={userData.height} onChange={e => handleChange('height', e.target.value)} />
      <StyledInput label="Weight (kg)" id="weight" type="number" value={userData.weight} onChange={e => handleChange('weight', e.target.value)} />
      <div className="md:col-span-2 mb-4">
        <label className="block text-sm font-medium text-[#A1887F] mb-1">Fitness Level</label>
        <select value={userData.fitnessLevel} onChange={e => handleChange('fitnessLevel', e.target.value)} className="w-full px-4 py-2.5 border border-[#F5E0D5] rounded-xl focus:ring-2 focus:ring-[#FFB6C1] focus:border-[#FFB6C1] bg-[#FFFFFF] text-[#6D4C41]">
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
        </select>
      </div>
      <div className="md:col-span-2 text-sm text-[#A1887F]">
        <strong>BMI:</strong> <span className="font-semibold text-[#6D4C41]">{calculateBMI(userData.weight, userData.height)}</span>
      </div>
    </Card>
  );

  const renderGoalsPreferences = () => (
    <Card title="Goals & Preferences" titleIcon={<Target />}>
      <StyledInput label="Current Fitness Goal" id="goalType" value={userData.goalType} onChange={e => handleChange('goalType', e.target.value)} placeholder="e.g., Weight Loss, Muscle Gain"/>
      <StyledInput label="Specific Target" id="goalTarget" value={userData.goalTarget} onChange={e => handleChange('goalTarget', e.target.value)} placeholder="e.g., Lose 5 kg, Run 5k" />
      <StyledInput label="Desired Timeframe" id="goalTimeframe" value={userData.goalTimeframe} onChange={e => handleChange('goalTimeframe', e.target.value)} placeholder="e.g., 3 months" />
      <StyledInput label="Preferred Workout Types" id="preferredWorkouts" value={userData.preferredWorkouts} onChange={e => handleChange('preferredWorkouts', e.target.value)} placeholder="e.g., Cardio, Strength, Yoga" />
      <StyledInput label="Available Equipment" id="availableEquipment" value={userData.availableEquipment} onChange={e => handleChange('availableEquipment', e.target.value)} placeholder="e.g., Dumbbells, Mat, None" />
      <StyledInput label="Time Constraints (per session)" id="timeConstraints" value={userData.timeConstraints} onChange={e => handleChange('timeConstraints', e.target.value)} placeholder="e.g., 30 mins, 1 hour" />
    </Card>
  );

  const renderProgressAnalytics = () => (
    <Card title="Progress & Analytics" titleIcon={<BarChart2 />}>
      <h3 className="md:col-span-2 text-lg font-medium text-[#6D4C41] mb-3">Body Metrics</h3>
      <StyledInput label="Most Recent Weight (kg)" id="recentWeight" type="number" value={userData.recentWeight} onChange={e => handleChange('recentWeight', e.target.value)} />
      <StyledInput label="Body Measurements" id="bodyMeasurements" value={userData.bodyMeasurements} onChange={e => handleChange('bodyMeasurements', e.target.value)} placeholder="e.g., Chest: 90cm, Waist: 75cm" />
      
      <h3 className="md:col-span-2 text-lg font-medium text-[#6D4C41] mt-4 mb-3">Workout Statistics</h3>
      <StyledInput label="Total Workouts Completed" id="totalWorkouts" type="number" value={userData.totalWorkouts} onChange={e => handleChange('totalWorkouts', e.target.value)} />
      <StyledInput label="Current Workout Streak (days)" id="streak" type="number" value={userData.streak} onChange={e => handleChange('streak', e.target.value)} />
      <StyledInput label="Favorite Exercises" id="favoriteExercises" value={userData.favoriteExercises} onChange={e => handleChange('favoriteExercises', e.target.value)} placeholder="e.g., Squats, Plank" />
      <StyledInput label="Most Active Days/Times" id="activeDaysTimes" value={userData.activeDaysTimes} onChange={e => handleChange('activeDaysTimes', e.target.value)} placeholder="e.g., Mon/Wed Morning" />
      <StyledInput label="Total Calories Burned (est.)" id="caloriesBurned" type="number" value={userData.caloriesBurned} onChange={e => handleChange('caloriesBurned', e.target.value)} />
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#FFF7F5] p-4 md:p-6 lg:p-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#6D4C41] flex items-center">
            <Edit3 className="w-8 h-8 mr-3 text-[#FFB6C1]" /> User Profile
        </h1>
        <button 
            onClick={() => navigate('/')} // Or to a sign-out route
            className="text-sm text-[#A1887F] hover:text-[#FFB6C1] flex items-center transition-colors"
            title="Sign Out (Placeholder)"
        >
            <LogOut className="w-4 h-4 mr-1" /> Sign Out
        </button>
      </header>

      {/* Tabs Navigation */}
      <div className="mb-8 flex space-x-2 border-b-2 border-[#FFDAC1]/50">
        {['basic', 'goals', 'progress'].map((tabId, index, arr) => (
            <button 
                key={tabId}
                onClick={() => setActiveTab(tabId)} 
                className={`px-4 py-3 text-sm font-medium transition-colors focus:outline-none
                            ${activeTab === tabId 
                                ? 'border-b-2 border-[#FFB6C1] text-[#FFB6C1]' 
                                : 'text-[#A1887F] hover:text-[#6D4C41]'
                            }
                            ${index === 0 ? 'rounded-tl-lg' : ''}
                            ${index === arr.length -1 ? 'rounded-tr-lg': ''}
                          `}
            >
            {tabId === 'basic' ? 'Basic Info' : tabId === 'goals' ? 'Goals & Preferences' : 'Progress & Analytics'}
          </button>
        ))}
      </div>

      {/* Conditional Tab Content */}
      {activeTab === 'basic' && renderBasicProfile()}
      {activeTab === 'goals' && renderGoalsPreferences()}
      {activeTab === 'progress' && renderProgressAnalytics()}

      <div className="mt-8 flex items-center justify-end space-x-4">
        {showConfirmation && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity:0 }}
                className="flex items-center text-green-600 text-sm"
            >
                <CheckCircle className="w-5 h-5 mr-2"/> Profile saved successfully!
            </motion.div>
        )}
        <button 
            onClick={() => navigate('/')} // Or to '/settings' as originally
            className="px-6 py-2.5 text-[#6D4C41] bg-[#FFDAC1]/50 hover:bg-[#FFDAC1]/80 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
        >
            Back
        </button>
        <button 
            className={`px-8 py-2.5 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center
                        ${emailError ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FFB6C1] hover:bg-opacity-80'}`}
            onClick={handleSave} 
            disabled={!!emailError}
        >
            <Save className="w-5 h-5 mr-2"/> Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;