// DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { Droplet, BedDouble, Activity, TrendingUp, ListChecks, CalendarClock, CheckCircle, BarChart3, User, Info } from 'lucide-react'; // Added some icons

function DashboardPage() {
  const location = useLocation();

  // Simulate fetching user data or using context/state management in a real app
  const [userData, setUserData] = useState({
    name: 'Desmond Voyage',
    weight: 70, // kg
    goalWeight: 65, // kg
    height: 165, // cm
    waterIntake: 5, // cups
    waterGoal: 8, // cups
    sleepHours: 7, // hrs
    sleepGoal: 7.5, // hrs
    fitnessLevel: 'Intermediate',
    ringProgress: 75, // percentage for a primary goal (e.g. weekly activity)
    weeklyProgress: [
      { day: 'Mon', activity: 30 }, { day: 'Tue', activity: 45 }, { day: 'Wed', activity: 60 },
      { day: 'Thu', activity: 30 }, { day: 'Fri', activity: 75 }, { day: 'Sat', activity: 90 },
      { day: 'Sun', activity: 40 },
    ],
    completedWorkouts: ['Cardio Blast - 45 min', 'Yoga Flow - 60 min', 'Strength 101 - 50 min', 'Morning Run - 30 min', 'Evening Stretch - 20 min'],
    upcomingWorkouts: ['HIIT Burn - Tomorrow 8:00 AM', 'Pilates - Sunday 10:00 AM'],
  });

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [location.hash]);

  const weightLost = userData.weight > userData.goalWeight ? userData.weight - userData.goalWeight : 0;
  const weightProgressPercent = userData.goalWeight < userData.weight ? 
    Math.min(((userData.weight - userData.goalWeight) / (userData.weight - userData.goalWeight + (userData.goalWeight - (userData.goalWeight*0.8)))) *100, 100) 
    : 100; // This logic might need refinement based on actual start weight. Let's assume current weight is start towards goal.
            // For simplicity, if goal is 60 and current is 70, let start be 75. Progress = (75-70)/(75-60) * 100
            // For now: progress towards goal:
  const initialWeight = 75; // Example initial weight
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

  const Card = ({ title, icon, children, className = "" }) => (
    <div className={`bg-[#FFFFFF] p-5 md:p-6 rounded-2xl shadow-lg border border-[#F5E0D5] ${className}`}>
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
        {/* User Quick Stats */}
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

        {/* Weight Progress to Goal */}
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
        
        {/* Primary Goal Ring (e.g. Weekly Activity) */}
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

        {/* Daily Trackers */}
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

        {/* Weekly Progress Chart */}
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
        
        {/* Completed Workouts */}
        <Card title="Completed Workouts" icon={<ListChecks />} id="completed-workouts" className="md:col-span-1 lg:col-span-3">
          {userData.completedWorkouts.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {userData.completedWorkouts.map((workout, idx) => (
                <li key={idx} className="flex items-center p-2 bg-[#FFDAC1]/20 rounded-lg">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0" />
                    <span className="text-[#6D4C41]">{workout}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[#A1887F] italic text-center py-4">No workouts completed yet. Let's get moving!</p>
          )}
        </Card>

        {/* Upcoming Workouts */}
        <Card title="Upcoming Schedule" icon={<CalendarClock />} className="md:col-span-1 lg:col-span-3">
           {userData.upcomingWorkouts.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {userData.upcomingWorkouts.map((workout, idx) => (
                <li key={idx} className="flex items-center p-2 bg-[#FFDAC1]/20 rounded-lg">
                    <CalendarClock className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                    <span className="text-[#6D4C41]">{workout}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[#A1887F] italic text-center py-4">No upcoming workouts. Time to plan!</p>
          )}
        </Card>
      </div>

      {/* Reminder / Tip Section */}
      <div className="mt-8 p-4 bg-[#FFDAC1]/40 border-l-4 border-[#FFB6C1] text-[#6D4C41] rounded-lg shadow-md">
        <h3 className="font-semibold flex items-center"><Info className="w-5 h-5 mr-2 text-[#FFB6C1]" /> Friendly Reminder</h3>
        <p className="text-sm">Consistency is key! Even a short workout is better than none. Keep up the great work!</p>
      </div>
    </div>
  );
}

export default DashboardPage;