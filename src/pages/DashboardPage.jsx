import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom'; 
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { Droplet, BedDouble, Activity, TrendingUp, ListChecks, CalendarClock, CheckCircle, BarChart3, User, Info, Clock, Repeat, Weight, StickyNote } from 'lucide-react';

const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

// Function to format time from "HH:mm" to "h:mm AM/PM"
const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours, 10);
    const m = parseInt(minutes, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 || 12; // Convert 0 to 12 for 12 AM/PM
    return `${formattedHours}:${m < 10 ? '0' : ''}${m} ${ampm}`;
};


function DashboardPage() {
  const location = useLocation();

  const [userData, setUserData] = useState({
    name: 'Desmond Voyage',
    weight: 70, 
    goalWeight: 65, 
    height: 165, 
    waterIntake: 5, 
    waterGoal: 8, 
    sleepHours: 7, 
    sleepGoal: 7.5, 
    fitnessLevel: 'Intermediate',
    ringProgress: 75, 
    weeklyProgress: [
      { day: 'Mon', activity: 30 }, { day: 'Tue', activity: 45 }, { day: 'Wed', activity: 60 },
      { day: 'Thu', activity: 30 }, { day: 'Fri', activity: 75 }, { day: 'Sat', activity: 90 },
      { day: 'Sun', activity: 40 },
    ],
    staticUpcomingWorkouts: [
        { id: 'static1', name: 'Yoga Session', dateString: 'Tomorrow at 9:00 AM' },
        { id: 'static2', name: 'Team Run', dateString: 'Next Monday at 6:30 PM' }
    ],
  });

  const [completedLoggedWorkouts, setCompletedLoggedWorkouts] = useState([]);
  const [upcomingLoggedWorkouts, setUpcomingLoggedWorkouts] = useState([]);

  useEffect(() => {
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
                    const logDateUTC = new Date(Date.UTC(logDate.getUTCFullYear(), logDate.getUTCMonth(), logDate.getUTCDate()));

                    if (logDateUTC >= today) {
                        if (logDateUTC.getTime() === today.getTime() && log.time) {
                            const now = new Date();
                            const [logHours, logMinutes] = log.time.split(':').map(Number);
                            if (logHours > now.getHours() || (logHours === now.getHours() && logMinutes > now.getMinutes())) {
                                future.push(log);
                            } else {
                                past.push(log);
                            }
                        } else if (logDateUTC > today) {
                           future.push(log);
                        }
                         else {
                            past.push(log);
                        }
                    } else {
                        past.push(log);
                    }
                });

                past.sort((a, b) => {
                    const dateComparison = new Date(b.date) - new Date(a.date);
                    if (dateComparison !== 0) return dateComparison;
                    return (b.time || "00:00").localeCompare(a.time || "00:00");
                });
                future.sort((a, b) => {
                    const dateComparison = new Date(a.date) - new Date(b.date);
                     if (dateComparison !== 0) return dateComparison;
                    return (a.time || "00:00").localeCompare(b.time || "00:00");
                }); 
                
                setCompletedLoggedWorkouts(past);
                setUpcomingLoggedWorkouts(future);
            }
        } catch (e) {
            console.error("Failed to parse logged workouts from localStorage", e);
            setCompletedLoggedWorkouts([]);
            setUpcomingLoggedWorkouts([]);
        }
    }
  }, [location.hash]);

  const weightLost = userData.weight > userData.goalWeight ? userData.weight - userData.goalWeight : 0;
  const initialWeight = 75; 
  const progressToGoal = initialWeight > userData.goalWeight ? ((initialWeight - userData.weight) / (initialWeight - userData.goalWeight)) * 100 : 0;


  const bmi = userData.height > 0 ? (userData.weight / ((userData.height / 100) ** 2)).toFixed(1) : 'N/A';
  const getBMIColor = () => {
    const val = parseFloat(bmi);
    if (isNaN(val)) return 'text-gray-500';
    if (val < 18.5) return 'text-blue-500';
    if (val < 24.9) return 'text-green-500';
    if (val < 29.9) return 'text-yellow-500';
    return 'text-red-500';
  };
  const getBMICategory = () => {
    const val = parseFloat(bmi);
    if (isNaN(val)) return '';
    if (val < 18.5) return "Underweight";
    if (val < 24.9) return "Normal";
    if (val < 29.9) return "Overweight";
    return "Obese";
  }

  const waterProgress = (userData.waterIntake / userData.waterGoal) * 100;
  const sleepProgress = (userData.sleepHours / userData.sleepGoal) * 100;

  const Card = ({ title, icon, children, className = "", id }) => (
    <div id={id} className={`bg-[#FFFFFF] p-5 md:p-6 rounded-2xl shadow-lg border border-[#F5E0D5] ${className}`}>
      {title && (
        <h2 className="text-xl font-semibold text-[#6D4C41] mb-4 flex items-center">
          {icon && React.cloneElement(icon, { className: "w-6 h-6 mr-3 text-[#FFB6C1]" })}
          {title}
        </h2>
      )}
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF7F5] p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#6D4C41]">
          Welcome back, <span className="text-[#FFB6C1]">{userData.name}</span>!
        </h1>
        <p className="text-md text-[#A1887F] mt-1">Here's your fitness journey at a glance.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Quick Stats" icon={<User />} className="lg:col-span-1">
            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-[#A1887F]">Weight:</span>
                    <span className="font-medium text-[#6D4C41]">{userData.weight} kg</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-[#A1887F]">Height:</span>
                    <span className="font-medium text-[#6D4C41]">{userData.height} cm</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-[#A1887F]">BMI:</span>
                    <span className={`font-medium ${getBMIColor()}`}>{bmi} <span className="text-xs text-[#A1887F]">({getBMICategory()})</span></span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-[#A1887F]">Fitness Level:</span>
                    <span className="font-medium text-[#6D4C41]">{userData.fitnessLevel}</span>
                </div>
            </div>
        </Card>

        <Card title="Weight Goal" icon={<TrendingUp />} className="lg:col-span-2">
          <div className="mb-3">
            <div className="flex justify-between text-sm text-[#A1887F] mb-1">
              <span>Current: {userData.weight} kg</span>
              <span>Goal: {userData.goalWeight} kg</span>
            </div>
            <div className="w-full bg-[#FFDAC1]/30 rounded-full h-3">
              <motion.div
                className="bg-[#FFB6C1] h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressToGoal > 100 ? 100 : progressToGoal < 0 ? 0 : progressToGoal}%`}}
                transition={{ duration: 0.8 }}
              />
            </div>
            <p className="text-xs text-[#A1887F] mt-1 text-right">{progressToGoal.toFixed(0)}% to goal (from {initialWeight}kg)</p>
          </div>
        </Card>
        
        <Card title="Weekly Activity Goal" icon={<Activity />} className="flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 sm:w-40 sm:h-40">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-[#FFDAC1]/50"
                strokeWidth="3.5" stroke="currentColor" fill="transparent"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                className="text-[#FFB6C1]"
                strokeWidth="3.5" strokeDasharray="100" strokeLinecap="round"
                stroke="currentColor" fill="transparent"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                initial={{ strokeDashoffset: 100 }}
                animate={{ strokeDashoffset: 100 - userData.ringProgress }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-[#6D4C41]">{userData.ringProgress}%</span>
              <span className="text-xs text-[#A1887F]">completed</span>
            </div>
          </div>
        </Card>

        <Card title="Daily Habits" icon={<CheckCircle />} className="lg:col-span-2">
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-[#6D4C41] flex items-center"><Droplet className="w-4 h-4 mr-2 text-[#FFB6C1]" />Water Intake</span>
                        <span className="text-xs text-[#A1887F]">{userData.waterIntake} / {userData.waterGoal} cups</span>
                    </div>
                    <div className="w-full bg-[#FFDAC1]/30 rounded-full h-2.5">
                        <motion.div className="bg-[#FFB6C1] h-2.5 rounded-full" initial={{width:0}} animate={{width: `${waterProgress}%`}} />
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-[#6D4C41] flex items-center"><BedDouble className="w-4 h-4 mr-2 text-[#FFB6C1]" />Sleep</span>
                        <span className="text-xs text-[#A1887F]">{userData.sleepHours} / {userData.sleepGoal} hrs</span>
                    </div>
                    <div className="w-full bg-[#FFDAC1]/30 rounded-full h-2.5">
                        <motion.div className="bg-[#FFB6C1] h-2.5 rounded-full" initial={{width:0}} animate={{width: `${sleepProgress}%`}} />
                    </div>
                </div>
            </div>
        </Card>

        <Card title="Weekly Activity Breakdown" icon={<BarChart3 />} className="md:col-span-2 lg:col-span-3">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={userData.weeklyProgress} margin={{ top: 5, right: 20, left: -25, bottom: 5 }}>
              <XAxis dataKey="day" stroke="#A1887F" fontSize={12} />
              <YAxis stroke="#A1887F" fontSize={12} />
              <Tooltip
                wrapperClassName="!rounded-lg !shadow-lg !border-none"
                contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '0.75rem', borderColor: '#F5E0D5' }}
                labelStyle={{ color: '#6D4C41', fontWeight: 'bold' }}
                itemStyle={{ color: '#FFB6C1' }}
              />
              <Legend formatter={(value) => <span className="text-[#A1887F] text-xs">{value.charAt(0).toUpperCase() + value.slice(1)} (min)</span>} />
              <Line type="monotone" dataKey="activity" stroke="#FFB6C1" strokeWidth={3} dot={{ r: 5, fill: '#FFB6C1', stroke: '#FFF7F5', strokeWidth: 2 }} activeDot={{ r: 7, fill: '#FFB6C1', stroke: '#FFF7F5', strokeWidth: 2 }} name="Activity" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        
        <Card title="Completed Workouts" icon={<ListChecks />} id="completed-workouts" className="md:col-span-1 lg:col-span-3">
          {completedLoggedWorkouts.length > 0 ? (
            <ul className="space-y-3">
              {completedLoggedWorkouts.map((log) => (
                <li key={log.logId} className="p-3 bg-[#FFDAC1]/20 rounded-lg shadow-sm border border-[#F5E0D5]/50">
                    <div className="flex justify-between items-start mb-1">
                        <Link to={`/workouts/${log.exerciseId}`} className="text-md font-semibold text-[#FFB6C1] hover:underline">
                            {capitalize(log.exerciseName)}
                        </Link>
                        <span className="text-xs text-[#A1887F] bg-[#FFFFFF] px-2 py-0.5 rounded-full border border-[#F5E0D5]">
                            {new Date(log.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            {log.time && ` at ${formatTime(log.time)}`}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs text-[#6D4C41]">
                        <div className="flex items-center"><Clock size={14} className="mr-1.5 text-[#A1887F]" /> Duration: {log.duration || 'N/A'}</div>
                        {log.sets && <div className="flex items-center"><Repeat size={14} className="mr-1.5 text-[#A1887F]" /> Sets: {log.sets}</div>}
                        {log.reps && <div className="flex items-center"><Activity size={14} className="mr-1.5 text-[#A1887F]" /> Reps: {log.reps}</div>}
                        {log.weight && <div className="flex items-center"><Weight size={14} className="mr-1.5 text-[#A1887F]" /> Weight: {log.weight} kg</div>}
                    </div>
                    {log.notes && (
                        <p className="mt-2 text-xs text-[#A1887F] bg-[#FFFFFF] p-2 rounded-md border border-[#F5E0D5]">
                           <StickyNote size={14} className="inline mr-1.5 mb-0.5 text-[#A1887F]" /> {log.notes}
                        </p>
                    )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[#A1887F] italic text-center py-4">No workouts logged yet. Go complete an exercise!</p>
          )}
        </Card>

        <Card title="Upcoming Schedule" icon={<CalendarClock />} id="upcoming-schedule" className="md:col-span-1 lg:col-span-3">
           {(upcomingLoggedWorkouts.length > 0 || userData.staticUpcomingWorkouts.length > 0) ? (
            <ul className="space-y-2 text-sm">
              {upcomingLoggedWorkouts.map((log) => (
                <li key={log.logId} className="flex items-center p-3 bg-[#FFDAC1]/20 rounded-lg border border-[#F5E0D5]/50">
                    <CalendarClock className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0" />
                    <div className="flex-grow">
                        <Link to={`/workouts/${log.exerciseId}`} className="font-semibold text-[#6D4C41] hover:text-[#FFB6C1]">
                            {capitalize(log.exerciseName)}
                        </Link>
                        <p className="text-xs text-[#A1887F]">
                            On: {new Date(log.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            {log.time && ` at ${formatTime(log.time)}`}
                            {log.duration && ` - Duration: ${log.duration}`}
                        </p>
                    </div>
                </li>
              ))}
              {upcomingLoggedWorkouts.length === 0 && userData.staticUpcomingWorkouts.map((workout) => ( // Fallback to static
                <li key={workout.id} className="flex items-center p-2 bg-[#FFDAC1]/20 rounded-lg">
                    <CalendarClock className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                    <span className="text-[#6D4C41]">{workout.name} - {workout.dateString}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[#A1887F] italic text-center py-4">No upcoming workouts. Time to plan!</p>
          )}
        </Card>
      </div>

      <div className="mt-8 p-4 bg-[#FFDAC1]/40 border-l-4 border-[#FFB6C1] text-[#6D4C41] rounded-lg shadow-md">
        <h3 className="font-semibold flex items-center"><Info className="w-5 h-5 mr-2 text-[#FFB6C1]" /> Friendly Reminder</h3>
        <p className="text-sm">Consistency is key! Even a short workout is better than none. Keep up the great work!</p>
      </div>
    </div>
  );
}

export default DashboardPage;