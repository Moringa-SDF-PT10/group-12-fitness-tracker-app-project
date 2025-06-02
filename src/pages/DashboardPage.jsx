import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
// Removed LineChart related imports as it's being replaced
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext'; // Use AuthContext
import {
    Droplet, BedDouble, Activity, TrendingUp, ListChecks, CalendarClock, CheckCircle,
    User, Info, Clock, Repeat, Weight, StickyNote, Edit3, Save, XCircle, Target as TargetIcon, CalendarDays, Plus, Trash2, Dumbbell
} from 'lucide-react';

const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours, 10);
    const m = parseInt(minutes, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${m < 10 ? '0' : ''}${m} ${ampm}`;
};

const getUserProfile = () => {
    const profileJSON = localStorage.getItem('userData');
    try { return profileJSON ? JSON.parse(profileJSON) : null; }
    catch (e) { console.error("Error parsing user profile:", e); return null; }
};

const saveUserProfile = (updatedProfile, userEmail) => {
    if (!updatedProfile) return;
    localStorage.setItem('userData', JSON.stringify(updatedProfile));
    if (userEmail) localStorage.setItem(`userData_${userEmail}`, JSON.stringify(updatedProfile));
};

// New Daily Activity Ring Component
const DailyActivityRing = ({ day, activityMinutes, dailyTargetMinutes, completedSession, size = 80 }) => {
    const radius = (size / 2) - 5; // 5 is half stroke-width approx
    const circumference = 2 * Math.PI * radius;
    const progress = dailyTargetMinutes > 0 ? Math.min(100, (activityMinutes / dailyTargetMinutes) * 100) : 0;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="flex flex-col items-center text-center">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                <circle
                    className="text-[#05BFDB]/20" // Lighter background for the ring track
                    strokeWidth="6"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <motion.circle
                    className="text-[#05BFDB]" // Main progress color
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                />
                 {completedSession && (
                    <CheckCircle className="text-green-500" size={size*0.3} x={size*0.35} y={size*0.35} transform="rotate(90)" transform-origin={`${size/2} ${size/2}`} />
                 )}
            </svg>
            <span className="mt-1 text-xs font-medium text-[#3E3E3E]">{day}</span>
            <span className="text-[10px] text-[#6C757D]">{activityMinutes} min</span>
        </div>
    );
};


function DashboardPage() {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(getUserProfile());
  const [completedLoggedWorkouts, setCompletedLoggedWorkouts] = useState([]);
  const [upcomingLoggedWorkouts, setUpcomingLoggedWorkouts] = useState([]);
  const [saveMessage, setSaveMessage] = useState('');

  const [showEditWeeklyGoalModal, setShowEditWeeklyGoalModal] = useState(false);
  const [showEditDailyHabitsModal, setShowEditDailyHabitsModal] = useState(false);
  const [showEditWeeklyActivityModal, setShowEditWeeklyActivityModal] = useState(false);

  // Initialize editable states from userProfile or defaults
  const [editableWeeklyGoalMinutes, setEditableWeeklyGoalMinutes] = useState(userProfile?.dashboard?.weeklyActivityMinutesGoal || 300);
  const [editableWeeklySessionGoalCount, setEditableWeeklySessionGoalCount] = useState(userProfile?.dashboard?.weeklySessionGoal?.count || 3);
  const [editableWeeklySessionGoalType, setEditableWeeklySessionGoalType] = useState(userProfile?.dashboard?.weeklySessionGoal?.type || 'any');
  const [editableBodyPartGoals, setEditableBodyPartGoals] = useState(userProfile?.dashboard?.bodyPartGoals || []);
  
  const [editableWaterGoal, setEditableWaterGoal] = useState(userProfile?.dashboard?.dailyWaterGoal || 8);
  const [editableCurrentWater, setEditableCurrentWater] = useState(userProfile?.dashboard?.currentWaterIntake || 0);
  const [editableSleepGoal, setEditableSleepHoursGoal] = useState(userProfile?.dashboard?.dailySleepHoursGoal || 7.5);
  const [editableCurrentSleep, setEditableCurrentSleep] = useState(userProfile?.dashboard?.currentSleepHours || 0);
  
  const [editableWeeklyActivityData, setEditableWeeklyActivityData] = useState(
    userProfile?.dashboard?.weeklyActivityData || 
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => ({ day: d, activity: 0, completedSession: false }))
  );

  // Derived data for display, reacting to userProfile changes
  const dashboardData = userProfile?.dashboard;
  const profileData = userProfile?.profile;

  const weeklyActivityMinutesGoal = dashboardData?.weeklyActivityMinutesGoal || 300;
  const weeklySessionGoal = dashboardData?.weeklySessionGoal || { count: 3, type: 'any' };
  const bodyPartGoals = dashboardData?.bodyPartGoals || [];

  const dailyWaterGoal = dashboardData?.dailyWaterGoal || 8;
  const currentWaterIntake = dashboardData?.currentWaterIntake || 0;
  const dailySleepHoursGoal = dashboardData?.dailySleepHoursGoal || 7.5;
  const currentSleepHours = dashboardData?.currentSleepHours || 0;
  const weeklyActivityData = dashboardData?.weeklyActivityData || 
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => ({ day: d, activity: 0, completedSession: false }));

  const totalWeeklyActivityAchieved = weeklyActivityData.reduce((sum, day) => sum + (Number(day.activity) || 0), 0);
  const totalSessionsCompleted = weeklyActivityData.filter(day => day.completedSession).length;
  
  // Overall progress ring for minutes goal
  const weeklyMinutesRingProgress = weeklyActivityMinutesGoal > 0 ? Math.min(100, (totalWeeklyActivityAchieved / weeklyActivityMinutesGoal) * 100) : 0;
  // Progress for session goal
  const weeklySessionProgress = weeklySessionGoal.count > 0 ? Math.min(100, (totalSessionsCompleted / weeklySessionGoal.count) * 100) : 0;
  

  useEffect(() => {
    const currentProfile = getUserProfile();
    if (currentProfile) {
        setUserProfile(currentProfile);
        setEditableWeeklyGoalMinutes(currentProfile.dashboard?.weeklyActivityMinutesGoal || 300);
        setEditableWeeklySessionGoalCount(currentProfile.dashboard?.weeklySessionGoal?.count || 3);
        setEditableWeeklySessionGoalType(currentProfile.dashboard?.weeklySessionGoal?.type || 'any');
        setEditableBodyPartGoals(currentProfile.dashboard?.bodyPartGoals || []);
        setEditableWaterGoal(currentProfile.dashboard?.dailyWaterGoal || 8);
        setEditableCurrentWater(currentProfile.dashboard?.currentWaterIntake || 0);
        setEditableSleepHoursGoal(currentProfile.dashboard?.dailySleepHoursGoal || 7.5);
        setEditableCurrentSleep(currentProfile.dashboard?.currentSleepHours || 0);
        setEditableWeeklyActivityData(currentProfile.dashboard?.weeklyActivityData || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => ({ day: d, activity: 0, completedSession: false })));
    }
    // ... (rest of useEffect for logged workouts and location.hash)
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    const storedLogsJSON = localStorage.getItem('loggedWorkouts');
    if (storedLogsJSON) {
        try {
            const parsedLogs = JSON.parse(storedLogsJSON);
            if (Array.isArray(parsedLogs)) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const past = [];
                const future = [];
                parsedLogs.forEach(log => {
                    const logDate = new Date(log.date);
                    const logDateOnly = new Date(logDate.getFullYear(), logDate.getMonth(), logDate.getDate());
                    if (logDateOnly < today) {
                        past.push(log);
                    } else if (logDateOnly > today) {
                        future.push(log);
                    } else {
                        if (log.time) {
                            const now = new Date();
                            const [logHours, logMinutes] = log.time.split(':').map(Number);
                            if (logHours < now.getHours() || (logHours === now.getHours() && logMinutes <= now.getMinutes())) {
                                past.push(log);
                            } else {
                                future.push(log);
                            }
                        } else {
                            past.push(log);
                        }
                    }
                });
                past.sort((a,b) => new Date(b.date) - new Date(a.date) || (b.time || "23:59").localeCompare(a.time || "23:59"));
                future.sort((a,b) => new Date(a.date) - new Date(b.date) || (a.time || "00:00").localeCompare(b.time || "00:00"));
                setCompletedLoggedWorkouts(past);
                setUpcomingLoggedWorkouts(future);
            }
        } catch(e) { console.error(e); }
    }

  }, [location.hash, user]);

  const handleSaveChanges = (updatedDashboardPart) => {
    if (!userProfile || !user?.email) {
        setSaveMessage("Error: User session not found."); setTimeout(() => setSaveMessage(''), 3000); return;
    }
    const newProfile = { ...userProfile, dashboard: { ...userProfile.dashboard, ...updatedDashboardPart } };
    setUserProfile(newProfile);
    saveUserProfile(newProfile, user.email);
    setSaveMessage("Changes saved!"); setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleSaveWeeklyGoal = () => {
    const newBodyPartGoals = editableBodyPartGoals.filter(g => g.bodyPart && g.count > 0); // Clean up empty goals
    handleSaveChanges({ 
        weeklyActivityMinutesGoal: Number(editableWeeklyGoalMinutes),
        weeklySessionGoal: {
            count: Number(editableWeeklySessionGoalCount),
            type: editableWeeklySessionGoalType,
        },
        bodyPartGoals: newBodyPartGoals,
    });
    setShowEditWeeklyGoalModal(false);
  };
  
  const handleAddBodyPartGoal = () => {
    setEditableBodyPartGoals([...editableBodyPartGoals, { bodyPart: '', count: 1 }]);
  };

  const handleBodyPartGoalChange = (index, field, value) => {
    const updatedGoals = [...editableBodyPartGoals];
    updatedGoals[index][field] = field === 'count' ? Number(value) : value;
    setEditableBodyPartGoals(updatedGoals);
  };
  
  const handleRemoveBodyPartGoal = (index) => {
    setEditableBodyPartGoals(editableBodyPartGoals.filter((_, i) => i !== index));
  };


  const handleSaveDailyHabits = () => {
    handleSaveChanges({
        dailyWaterGoal: Number(editableWaterGoal), currentWaterIntake: Number(editableCurrentWater),
        dailySleepHoursGoal: Number(editableSleepGoal), currentSleepHours: Number(editableCurrentSleep)
    });
    setShowEditDailyHabitsModal(false);
  };

  const handleSaveWeeklyActivityData = () => {
    const validatedData = editableWeeklyActivityData.map(d => ({...d, activity: Number(d.activity) || 0, completedSession: d.completedSession || false }));
    handleSaveChanges({ weeklyActivityData: validatedData });
    setShowEditWeeklyActivityModal(false);
  };

  const weight = profileData?.weight || 'N/A';
  const height = profileData?.height || 'N/A';
  const goalWeight = profileData?.goalWeight || 'N/A';
  const fitnessLevel = profileData?.fitnessLevel || 'N/A';
  const userName = profileData?.name || user?.name || 'User';
  const initialWeightForGoal = profileData?.initialWeight || (Number(weight) + 5) || 75;
  const progressToGoal = (weight !== 'N/A' && goalWeight !== 'N/A' && initialWeightForGoal > goalWeight)
    ? Math.max(0, Math.min(100, ((initialWeightForGoal - Number(weight)) / (initialWeightForGoal - Number(goalWeight))) * 100)) : 0;
  const bmi = (height !== 'N/A' && Number(height) > 0 && weight !== 'N/A') ? (Number(weight) / ((Number(height) / 100) ** 2)).toFixed(1) : 'N/A';
  const getBMIColor = () => {
    const val = parseFloat(bmi);
    if (isNaN(val)) return 'text-[#6C757D]';
    if (val < 18.5) return 'text-blue-500';
    if (val < 24.9) return 'text-[#28A745]';
    if (val < 29.9) return 'text-[#FFC107]';
    return 'text-[#DC3545]';
  };
  const getBMICategory = () => {
    const val = parseFloat(bmi);
    if (isNaN(val)) return '';
    if (val < 18.5) return "Underweight";
    if (val < 24.9) return "Normal";
    if (val < 29.9) return "Overweight";
    return "Obese";
  };
  const waterProgress = dailyWaterGoal > 0 ? Math.min(100, (currentWaterIntake / dailyWaterGoal) * 100) : 0;
  const sleepProgress = dailySleepHoursGoal > 0 ? Math.min(100, (currentSleepHours / dailySleepHoursGoal) * 100) : 0;

  const Card = ({ title, icon, children, className = "", id, onEdit }) => (
    <div id={id} className={`bg-[#FFFFFF] p-5 md:p-6 rounded-2xl shadow-lg border border-[#D1D1D1] ${className}`}>
      <div className="flex justify-between items-center mb-4">
        {title && (<h2 className="text-xl font-semibold text-[#0B0B0B] flex items-center">{icon && React.cloneElement(icon, { className: "w-6 h-6 mr-3 text-[#05BFDB]" })} {title}</h2>)}
        {onEdit && (<button onClick={onEdit} className="p-1.5 text-[#05BFDB] hover:text-[#049DB4] rounded-md hover:bg-[#05BFDB]/10"><Edit3 size={18} /></button>)}
      </div>
      {children}
    </div>
  );
  const Modal = ({ isOpen, onClose, title, children, onSave }) => {
    if (!isOpen) return null;
    return (<div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"><motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md"><div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold text-[#0B0B0B]">{title}</h3><button onClick={onClose} className="text-[#6C757D] hover:text-[#3E3E3E]"><XCircle size={24} /></button></div><div className="space-y-4">{children}</div><div className="mt-8 flex justify-end space-x-3"><button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-[#3E3E3E] rounded-lg hover:bg-gray-300">Cancel</button><button type="button" onClick={onSave} className="px-4 py-2 bg-[#0A4D68] text-white rounded-lg hover:bg-[#083D53]"><Save size={16} className="inline mr-2" />Save</button></div></motion.div></div>);
  };

  if (!userProfile) return (<div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#F5F5F5]"><Loader2 className="h-16 w-16 animate-spin text-[#05BFDB]" /><p className="mt-4 text-xl text-[#6C757D]">Loading...</p></div>);

  const bodyPartOptions = ["Legs", "Back", "Chest", "Shoulders", "Arms", "Core", "Full Body"];

  return (
    <div className="min-h-screen bg-[#F5F5F5] p-4 md:p-6 lg:p-8">
      {saveMessage && (<div className="mb-4 p-3 bg-green-100 border-green-400 text-green-700 rounded-lg text-center fixed top-5 left-1/2 -translate-x-1/2 z-50 shadow-lg">{saveMessage}</div>)}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#0B0B0B]">Welcome back, <span className="text-[#05BFDB]">{userName}</span>!</h1>
        <p className="text-md text-[#3E3E3E] mt-1">Here's your fitness journey at a glance.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Quick Stats" icon={<User />} className="lg:col-span-1">
            <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-[#6C757D]">Weight:</span><span className="font-medium text-[#3E3E3E]">{weight} kg</span></div>
                <div className="flex justify-between"><span className="text-[#6C757D]">Height:</span><span className="font-medium text-[#3E3E3E]">{height} cm</span></div>
                <div className="flex justify-between"><span className="text-[#6C757D]">BMI:</span><span className={`font-medium ${getBMIColor()}`}>{bmi} <span className="text-xs text-[#6C757D]">({getBMICategory()})</span></span></div>
                <div className="flex justify-between"><span className="text-[#6C757D]">Fitness Level:</span><span className="font-medium text-[#3E3E3E]">{fitnessLevel}</span></div>
            </div>
        </Card>
        <Card title="Weight Goal" icon={<TrendingUp />} className="lg:col-span-2">
            <div className="mb-3">
                <div className="flex justify-between text-sm text-[#6C757D] mb-1">
                <span>Current: {weight} kg</span>
                <span>Goal: {goalWeight} kg</span>
                </div>
                <div className="w-full bg-[#05BFDB]/20 rounded-full h-3">
                <motion.div className="bg-[#05BFDB] h-3 rounded-full" initial={{ width: 0 }} animate={{ width: `${progressToGoal}%`}} transition={{ duration: 0.8 }} />
                </div>
                <p className="text-xs text-[#6C757D] mt-1 text-right">{progressToGoal.toFixed(0)}% to goal (from {initialWeightForGoal}kg)</p>
            </div>
        </Card>
        
        <Card title="Weekly Activity Goals" icon={<TargetIcon />} onEdit={() => setShowEditWeeklyGoalModal(true)}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-sm text-[#3E3E3E] flex items-center"><Activity className="w-4 h-4 mr-2 text-[#05BFDB]" /> Total Minutes:</span>
                <span className="text-sm font-semibold text-[#0B0B0B]">{totalWeeklyActivityAchieved} / {weeklyActivityMinutesGoal} min</span>
            </div>
            <div className="w-full bg-[#05BFDB]/20 rounded-full h-2.5"><motion.div className="bg-[#05BFDB] h-2.5 rounded-full" initial={{width:0}} animate={{width: `${weeklyMinutesRingProgress}%`}} /></div>
            
            <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-[#3E3E3E] flex items-center"><Dumbbell className="w-4 h-4 mr-2 text-[#05BFDB]" /> Sessions ({capitalize(weeklySessionGoal.type)}):</span>
                <span className="text-sm font-semibold text-[#0B0B0B]">{totalSessionsCompleted} / {weeklySessionGoal.count}</span>
            </div>
            <div className="w-full bg-[#05BFDB]/20 rounded-full h-2.5"><motion.div className="bg-[#05BFDB] h-2.5 rounded-full" initial={{width:0}} animate={{width: `${weeklySessionProgress}%`}} /></div>

            {bodyPartGoals.length > 0 && <p className="text-xs text-[#6C757D] mt-2 pt-2 border-t border-[#E0E0E0]">Body Part Focus:</p>}
            {bodyPartGoals.map((goal, index) => (
                <div key={index} className="text-xs text-[#3E3E3E] flex justify-between">
                    <span>{capitalize(goal.bodyPart)}:</span>
                    <span>{weeklyActivityData.filter(d => d.completedSession && d.bodyPartTarget === goal.bodyPart).length} / {goal.count} sessions</span>
                </div>
            ))}
          </div>
        </Card>

        <Card title="Daily Habits" icon={<CheckCircle />} className="lg:col-span-2" onEdit={() => setShowEditDailyHabitsModal(true)}>
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-[#3E3E3E] flex items-center"><Droplet className="w-4 h-4 mr-2 text-[#05BFDB]" />Water Intake</span>
                        <span className="text-xs text-[#6C757D]">{currentWaterIntake} / {dailyWaterGoal} cups</span>
                    </div>
                    <div className="w-full bg-[#05BFDB]/20 rounded-full h-2.5"><motion.div className="bg-[#05BFDB] h-2.5 rounded-full" initial={{width:0}} animate={{width: `${waterProgress}%`}} /></div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-[#3E3E3E] flex items-center"><BedDouble className="w-4 h-4 mr-2 text-[#05BFDB]" />Sleep</span>
                        <span className="text-xs text-[#6C757D]">{currentSleepHours} / {dailySleepHoursGoal} hrs</span>
                    </div>
                    <div className="w-full bg-[#05BFDB]/20 rounded-full h-2.5"><motion.div className="bg-[#05BFDB] h-2.5 rounded-full" initial={{width:0}} animate={{width: `${sleepProgress}%`}} /></div>
                </div>
            </div>
        </Card>

        <Card title="Daily Activity Rings" icon={<CalendarDays />} className="md:col-span-2 lg:col-span-3" onEdit={() => setShowEditWeeklyActivityModal(true)}>
          <div className="flex flex-wrap justify-around gap-2 p-2">
            {weeklyActivityData.map((dayData) => (
              <DailyActivityRing
                key={dayData.day}
                day={dayData.day}
                activityMinutes={dayData.activity}
                dailyTargetMinutes={weeklyActivityMinutesGoal > 0 ? Math.round(weeklyActivityMinutesGoal / 7) : 60} // Example daily target
                completedSession={dayData.completedSession}
                size={window.innerWidth < 640 ? 60 : 80} // Smaller rings on small screens
              />
            ))}
          </div>
        </Card>
        
        <Card title="Completed Workouts" icon={<ListChecks />} id="completed-workouts" className="md:col-span-1 lg:col-span-3">
          {completedLoggedWorkouts.length > 0 ? (
            <ul className="space-y-3">
              {completedLoggedWorkouts.map((log) => (
                <li key={log.logId} className="p-3 bg-[#0A4D68]/5 rounded-lg shadow-sm border border-[#D1D1D1]/50">
                    <div className="flex justify-between items-start mb-1">
                        <Link to={`/workouts/${log.exerciseId}`} className="text-md font-semibold text-[#0A4D68] hover:text-[#083D53]">{capitalize(log.exerciseName)}</Link>
                        <span className="text-xs text-[#6C757D] bg-[#FFFFFF] px-2 py-0.5 rounded-full border border-[#D1D1D1]">{new Date(log.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}{log.time && ` at ${formatTime(log.time)}`}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs text-[#3E3E3E]">
                        <div className="flex items-center"><Clock size={14} className="mr-1.5 text-[#6C757D]" /> Duration: {log.duration || 'N/A'}</div>
                        {log.sets && <div className="flex items-center"><Repeat size={14} className="mr-1.5 text-[#6C757D]" /> Sets: {log.sets}</div>}
                        {log.reps && <div className="flex items-center"><Activity size={14} className="mr-1.5 text-[#6C757D]" /> Reps: {log.reps}</div>}
                        {log.weight && <div className="flex items-center"><Weight size={14} className="mr-1.5 text-[#6C757D]" /> Weight: {log.weight} kg</div>}
                    </div>
                    {log.notes && (<p className="mt-2 text-xs text-[#6C757D] bg-[#FFFFFF] p-2 rounded-md border border-[#D1D1D1]"><StickyNote size={14} className="inline mr-1.5 mb-0.5 text-[#6C757D]" /> {log.notes}</p>)}
                </li>
              ))}
            </ul>
          ) : (<p className="text-[#6C757D] italic text-center py-4">No workouts logged yet. Go complete an exercise!</p>)}
        </Card>
        <Card title="Upcoming Schedule" icon={<CalendarClock />} id="upcoming-schedule" className="md:col-span-1 lg:col-span-3">
           {(upcomingLoggedWorkouts.length > 0 || (userProfile?.staticUpcomingWorkouts && userProfile.staticUpcomingWorkouts.length > 0)) ? (
            <ul className="space-y-2 text-sm">
              {upcomingLoggedWorkouts.map((log) => (
                <li key={log.logId} className="flex items-center p-3 bg-[#0A4D68]/5 rounded-lg border border-[#D1D1D1]/50">
                    <CalendarClock className="w-5 h-5 mr-3 text-[#17A2B8] flex-shrink-0" />
                    <div className="flex-grow">
                        <Link to={`/workouts/${log.exerciseId}`} className="font-semibold text-[#0A4D68] hover:text-[#083D53]">{capitalize(log.exerciseName)}</Link>
                        <p className="text-xs text-[#6C757D]">On: {new Date(log.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}{log.time && ` at ${formatTime(log.time)}`}{log.duration && ` - Duration: ${log.duration}`}</p>
                    </div>
                </li>
              ))}
              {upcomingLoggedWorkouts.length === 0 && userProfile?.staticUpcomingWorkouts?.map((workout) => (
                <li key={workout.id} className="flex items-center p-2 bg-[#0A4D68]/5 rounded-lg">
                    <CalendarClock className="w-4 h-4 mr-2 text-[#17A2B8] flex-shrink-0" />
                    <span className="text-[#3E3E3E]">{workout.name} - {workout.dateString}</span>
                </li>
              ))}
            </ul>
          ) : (<p className="text-[#6C757D] italic text-center py-4">No upcoming workouts. Time to plan!</p>)}
        </Card>
      </div>

      <div className="mt-8 p-4 bg-[#17A2B8]/10 border-l-4 border-[#17A2B8] text-[#0A4D68] rounded-lg shadow-md">
        <h3 className="font-semibold flex items-center"><Info className="w-5 h-5 mr-2 text-[#17A2B8]" /> Friendly Reminder</h3>
        <p className="text-sm">Consistency is key! Even a short workout is better than none. Keep up the great work!</p>
      </div>

      {/* MODALS */}
      <Modal isOpen={showEditWeeklyGoalModal} onClose={() => setShowEditWeeklyGoalModal(false)} title="Edit Weekly Activity Goals" onSave={handleSaveWeeklyGoal}>
        <div>
            <label htmlFor="weeklyGoalMinutesInput" className="block text-sm font-medium text-[#6C757D] mb-1">Total Weekly Activity Minutes Goal:</label>
            <input type="number" id="weeklyGoalMinutesInput" value={editableWeeklyGoalMinutes} onChange={(e) => setEditableWeeklyGoalMinutes(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#B0B0B0] rounded-xl focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-[#FFFFFF] text-[#3E3E3E] placeholder-[#6C757D]"/>
        </div>
        <div className="mt-4">
            <label htmlFor="weeklySessionGoalCountInput" className="block text-sm font-medium text-[#6C757D] mb-1">Target Workout Sessions Per Week:</label>
            <input type="number" id="weeklySessionGoalCountInput" value={editableWeeklySessionGoalCount} onChange={(e) => setEditableWeeklySessionGoalCount(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#B0B0B0] rounded-xl focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-[#FFFFFF] text-[#3E3E3E] placeholder-[#6C757D]"/>
        </div>
        <div className="mt-4">
            <label htmlFor="weeklySessionGoalTypeInput" className="block text-sm font-medium text-[#6C757D] mb-1">Session Type Focus (e.g., any, cardio, strength):</label>
            <input type="text" id="weeklySessionGoalTypeInput" value={editableWeeklySessionGoalType} onChange={(e) => setEditableWeeklySessionGoalType(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#B0B0B0] rounded-xl focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-[#FFFFFF] text-[#3E3E3E] placeholder-[#6C757D]"/>
        </div>
        <div className="mt-4">
            <h4 className="text-md font-medium text-[#3E3E3E] mb-2">Body Part Focus Goals:</h4>
            {editableBodyPartGoals.map((goal, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                    <select value={goal.bodyPart} onChange={(e) => handleBodyPartGoalChange(index, 'bodyPart', e.target.value)}
                        className="flex-grow px-3 py-2.5 border border-[#B0B0B0] rounded-xl focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-[#FFFFFF] text-[#3E3E3E]">
                        <option value="">Select Body Part</option>
                        {bodyPartOptions.map(opt => <option key={opt} value={opt.toLowerCase()}>{opt}</option>)}
                    </select>
                    <input type="number" value={goal.count} onChange={(e) => handleBodyPartGoalChange(index, 'count', e.target.value)} min="1"
                        className="w-20 px-3 py-2.5 border border-[#B0B0B0] rounded-xl focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-[#FFFFFF] text-[#3E3E3E]" placeholder="Count"/>
                    <button onClick={() => handleRemoveBodyPartGoal(index)} className="p-2 text-red-500 hover:text-red-700"><Trash2 size={18}/></button>
                </div>
            ))}
            <button onClick={handleAddBodyPartGoal} className="mt-1 text-sm text-[#05BFDB] hover:text-[#049DB4] flex items-center">
                <Plus size={16} className="mr-1"/> Add Body Part Goal
            </button>
        </div>
      </Modal>

      <Modal isOpen={showEditDailyHabitsModal} onClose={() => setShowEditDailyHabitsModal(false)} title="Edit Daily Habits" onSave={handleSaveDailyHabits}>
        <label htmlFor="waterGoalInput" className="block text-sm font-medium text-[#6C757D] mb-1">Daily Water Goal (cups):</label>
        <input type="number" id="waterGoalInput" value={editableWaterGoal} onChange={(e) => setEditableWaterGoal(e.target.value)} className="w-full mb-3 px-3 py-2.5 border border-[#B0B0B0] rounded-xl focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-[#FFFFFF] text-[#3E3E3E]"/>
        
        <label htmlFor="currentWaterInput" className="block text-sm font-medium text-[#6C757D] mb-1">Today's Water Intake (cups):</label>
        <input type="number" id="currentWaterInput" value={editableCurrentWater} onChange={(e) => setEditableCurrentWater(e.target.value)} className="w-full mb-3 px-3 py-2.5 border border-[#B0B0B0] rounded-xl focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-[#FFFFFF] text-[#3E3E3E]"/>

        <label htmlFor="sleepGoalInput" className="block text-sm font-medium text-[#6C757D] mb-1">Daily Sleep Goal (hours):</label>
        <input type="number" step="0.1" id="sleepGoalInput" value={editableSleepGoal} onChange={(e) => setEditableSleepHoursGoal(e.target.value)} className="w-full mb-3 px-3 py-2.5 border border-[#B0B0B0] rounded-xl focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-[#FFFFFF] text-[#3E3E3E]"/>
        
        <label htmlFor="currentSleepInput" className="block text-sm font-medium text-[#6C757D] mb-1">Today's Sleep (hours):</label>
        <input type="number" step="0.1" id="currentSleepInput" value={editableCurrentSleep} onChange={(e) => setEditableCurrentSleep(e.target.value)} className="w-full px-3 py-2.5 border border-[#B0B0B0] rounded-xl focus:ring-2 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-[#FFFFFF] text-[#3E3E3E]"/>
      </Modal>

      <Modal isOpen={showEditWeeklyActivityModal} onClose={() => setShowEditWeeklyActivityModal(false)} title="Edit Daily Activity (Minutes & Sessions)" onSave={handleSaveWeeklyActivityData}>
        {editableWeeklyActivityData.map((dayData, index) => (
            <div key={index} className="grid grid-cols-3 items-center gap-2 mb-2">
                <label htmlFor={`activityDay-${dayData.day}`} className="text-sm font-medium text-[#3E3E3E] col-span-1">{dayData.day}:</label>
                <input
                    type="number"
                    id={`activityDayMinutes-${dayData.day}`}
                    value={dayData.activity}
                    onChange={(e) => {
                        const newData = [...editableWeeklyActivityData];
                        newData[index].activity = Number(e.target.value);
                        setEditableWeeklyActivityData(newData);
                    }}
                    className="col-span-1 px-3 py-2 border border-[#B0B0B0] rounded-lg focus:ring-1 focus:ring-[#05BFDB] focus:border-[#05BFDB] bg-white text-[#3E3E3E]"
                    placeholder="Mins"
                />
                <div className="col-span-1 flex items-center justify-end">
                    <label htmlFor={`activityDaySession-${dayData.day}`} className="text-xs text-[#6C757D] mr-1.5">Session?</label>
                    <input
                        type="checkbox"
                        id={`activityDaySession-${dayData.day}`}
                        checked={dayData.completedSession || false}
                        onChange={(e) => {
                            const newData = [...editableWeeklyActivityData];
                            newData[index].completedSession = e.target.checked;
                            setEditableWeeklyActivityData(newData);
                        }}
                        className="form-checkbox h-4 w-4 text-[#05BFDB] rounded border-gray-300 focus:ring-[#05BFDB]/50"
                    />
                </div>
            </div>
        ))}
      </Modal>

    </div>
  );
}

export default DashboardPage;
