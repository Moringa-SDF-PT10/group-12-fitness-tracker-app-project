import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { LayoutGrid, User, Settings as SettingsIcon, Dumbbell } from 'lucide-react'; // Icons for Nav bar

// Import pages (ensure these paths are correct)
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import WorkoutsPage from './pages/WorkoutsPage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';

const App = () => {
  const navLinkBaseClass = "inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ease-in-out";
  const navLinkInactiveClass = "text-[#6D4C41] hover:bg-[#FFDAC1]/40 hover:text-[#FFB6C1]";
  const navLinkActiveClass = "bg-[#FFB6C1] text-white shadow-md";

  return (
    <Router>
      {/* Main application container */}
      <div className="flex flex-col min-h-screen bg-[#FFF7F5]">
        
        {/* Styled Navigation Bar */}
        <nav className="bg-[#FFFFFF] shadow-lg border-b border-[#F5E0D5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="font-bold text-xl text-[#FFB6C1]">FitApp</span>
                </div>
              </div>
              
              {/* Navigation Links */}
              <div className="hidden md:flex md:items-center md:space-x-3">
                <NavLink
                  to="/workouts"
                  className={({ isActive }) =>
                    `${navLinkBaseClass} ${isActive ? navLinkActiveClass : navLinkInactiveClass}`
                  }
                >
                  <Dumbbell className="w-4 h-4 mr-2" /> Workouts
                </NavLink>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `${navLinkBaseClass} ${isActive ? navLinkActiveClass : navLinkInactiveClass}`
                  }
                >
                  <LayoutGrid className="w-4 h-4 mr-2" /> Dashboard
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `${navLinkBaseClass} ${isActive ? navLinkActiveClass : navLinkInactiveClass}`
                  }
                >
                  <User className="w-4 h-4 mr-2" /> Profile
                </NavLink>
                <NavLink
                  to="/settings"
                  className={({ isActive }) =>
                    `${navLinkBaseClass} ${isActive ? navLinkActiveClass : navLinkInactiveClass}`
                  }
                >
                  <SettingsIcon className="w-4 h-4 mr-2" /> Settings
                </NavLink>
              </div>
              <div className="md:hidden flex items-center">
                <button className="p-2 rounded-md text-[#6D4C41] hover:text-[#FFB6C1] hover:bg-[#FFDAC1]/30 focus:outline-none">
                  <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow">
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

export default App;