import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  const { user } = useAuth();

  const [userData, setUserData] = useState({
    name: user?.name || 'Desmond Voyage',
    weight: 70,
    goalWeight: 60,
    height: 165,
    waterIntake: 5,
    sleepHours: 7,
    fitnessLevel: 'intermediate',
    goalsCompleted: 4,
    goalsTotal: 6,
    ringProgress: 75,
    weeklyProgress: [
      { day: 'Mon', value: 1 },
      { day: 'Tue', value: 2 },
      { day: 'Wed', value: 1 },
      { day: 'Thu', value: 3 },
      { day: 'Fri', value: 2 },
      { day: 'Sat', value: 1 },
      { day: 'Sun', value: 2 },
    ],
    completedWorkouts: ['Cardio Blast', 'Yoga Flow', 'Strength 101'],
    upcomingWorkouts: ['HIIT Burn - Tomorrow', 'Pilates - Sunday'],
  });

  const weightProgress = Math.min((userData.weight / userData.goalWeight) * 100, 100);
  const bmi = (userData.weight / ((userData.height / 100) ** 2)).toFixed(1);

  const getBMIColor = () => {
    const val = parseFloat(bmi);
    if (val < 18.5) return 'blue';
    if (val < 24.9) return 'green';
    if (val < 29.9) return 'orange';
    return 'red';
  };

  return (
    <div className="dashboard p-6 text-center">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        {user ? `Welcome, ${user.name}` : 'Welcome'}
      </h1>

      <div className="section">
        <h2>Weight Progress</h2>
        <motion.div className="progress-bar bg-blue-400 h-4 rounded" initial={{ width: 0 }} animate={{ width: `${weightProgress}%` }} />
        <p>{userData.weight}kg / {userData.goalWeight}kg</p>
      </div>

      <div className="section">
        <h2>BMI</h2>
        <p style={{ color: getBMIColor() }}>{bmi}</p>
      </div>

      <div className="section">
        <h2>Goal Completion</h2>
        <motion.div
          className="ring"
          initial={{ strokeDashoffset: 100 }}
          animate={{ strokeDashoffset: 100 - userData.ringProgress }}
        >
          <svg viewBox="0 0 36 36">
            <path
              className="circle-bg"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="circle"
              strokeDasharray={`${userData.ringProgress}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="20.35" className="percentage">{userData.ringProgress}%</text>
          </svg>
        </motion.div>
      </div>

      <div className="section">
        <h2>Weekly Progress</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={userData.weeklyProgress}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="section trackers">
        <div>
          <h3>Water Intake</h3>
          <p>{userData.waterIntake} cups</p>
        </div>
        <div>
          <h3>Sleep Hours</h3>
          <p>{userData.sleepHours} hrs</p>
        </div>
      </div>

      <div className="section">
        <h2>Completed Workouts</h2>
        <ul>
          {userData.completedWorkouts.map((workout, idx) => <li key={idx}>{workout}</li>)}
        </ul>
      </div>

      <div className="section">
        <h2>Upcoming Workouts</h2>
        <ul>
          {userData.upcomingWorkouts.map((workout, idx) => <li key={idx}>{workout}</li>)}
        </ul>
      </div>

      <div className="section reminder">
        <h3>💧💧 Stay hydrated champ! Drink a glass of water.</h3>
      </div>
    </div>
  );
}

export default DashboardPage;
