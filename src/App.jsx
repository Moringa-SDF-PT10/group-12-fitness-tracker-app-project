import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { LayoutGrid, User, Settings as SettingsIcon, Dumbbell } from 'lucide-react';

import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Import all pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import WorkoutsPage from './pages/WorkoutsPage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

const NavBar = () => {
    const { user } = useContext(AuthContext);
    const navLinkBaseClass = "inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ease-in-out";
    const navLinkInactiveClass = "text-[#E0E0E0] hover:bg-[#05BFDB]/20 hover:text-[#FFFFFF]";
    const navLinkActiveClass = "bg-[#05BFDB] text-[#0B0B0B] shadow-md";

    if (!user) return null;

    return (
        <nav className="bg-[#0A4D68] shadow-lg border-b border-[#083D53]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="font-bold text-xl text-[#FFFFFF]">Fit-Mate</span>
                        </div>
                    </div>
                    
                    <div className="hidden md:flex md:items-center md:space-x-3">
                        <NavLink
                            to="/workouts"
                            className={({ isActive }) => `${navLinkBaseClass} ${isActive ? navLinkActiveClass : navLinkInactiveClass}`}
                        >
                            <Dumbbell className="w-4 h-4 mr-2" /> Workouts
                        </NavLink>
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) => `${navLinkBaseClass} ${isActive ? navLinkActiveClass : navLinkInactiveClass}`}
                        >
                            <LayoutGrid className="w-4 h-4 mr-2" /> Dashboard
                        </NavLink>
                        <NavLink
                            to="/profile"
                            className={({ isActive }) => `${navLinkBaseClass} ${isActive ? navLinkActiveClass : navLinkInactiveClass}`}
                        >
                            <User className="w-4 h-4 mr-2" /> Profile
                        </NavLink>
                        <NavLink
                            to="/settings"
                            className={({ isActive }) => `${navLinkBaseClass} ${isActive ? navLinkActiveClass : navLinkInactiveClass}`}
                        >
                            <SettingsIcon className="w-4 h-4 mr-2" /> Settings
                        </NavLink>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button className="p-2 rounded-md text-[#FFFFFF] hover:text-[#05BFDB] hover:bg-[#FFFFFF]/20 focus:outline-none">
                            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="flex flex-col min-h-screen bg-[#F5F5F5]">
                    <NavBar />
                    <main className="flex-grow p-4">
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                            <Route path="/reset-password" element={<ResetPasswordPage />} />

                            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                            <Route path="/workouts" element={<ProtectedRoute><WorkoutsPage /></ProtectedRoute>} />
                            <Route path="/workouts/:workoutId" element={<ProtectedRoute><WorkoutDetailPage /></ProtectedRoute>} />
                            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                            
                            <Route path="*" element={<Navigate replace to="/" />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
