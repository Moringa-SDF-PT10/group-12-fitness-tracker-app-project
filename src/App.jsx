// Merged App.jsx
import React from 'react'; // useEffect and useState for custom routing are no longer needed here
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';

// Import pages from both versions
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import WorkoutsPage from './pages/WorkoutsPage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';


const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <nav className="navbar bg-gray-800 p-4 text-white">
          <NavLink
            to="/workouts"
            className={({ isActive }) =>
              isActive ? 'navlink navlink-active px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900' : 'navlink px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
            }
          >
            Workouts
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? 'navlink navlink-active px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900' : 'navlink px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? 'navlink navlink-active px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900' : 'navlink px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive ? 'navlink navlink-active px-3 py-2 rounded-md text-sm font-medium text-white bg-gray-900' : 'navlink px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
            }
          >
            Settings
          </NavLink>
        </nav>

        <main className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<Navigate replace to="/workouts" />} /> 
            <Route path="/workouts" element={<WorkoutsPage />} />
            <Route path="/workouts/:workoutId" element={<WorkoutDetailPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="*" element={<Navigate replace to="/workouts" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;;